import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import customerController from '../../controllers/customer.controller';
import { customerCreateValidationSchema } from '../../validators/customer-create.validator';
import { ROLES } from '../../constant';
import assignmentController from '../../controllers/assignment.controller';
import customerConnectorConfigController from '../../controllers/customer-connector-config.controller';
import { dlChangeValidationSchema } from '../../validators/dl-change-proposal.validator';
import logger from '../../utils/logger';
import connectorController from '../../controllers/connectorController';

router.post('/',
  auth,
  hasRole([ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const vData = await customerCreateValidationSchema.validate(req.body)
      await customerController.addCustomer(vData)
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has added a customer`
      })
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let data = await customerController.listCustomers(req.query.status as string)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/codes',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2, ROLES.LEVEL1]),
  async (req: Request, res: Response) => {
    try {
      if (req.user?.role == ROLES.ADMIN || req.user?.role == ROLES.LEVEL3) {
        const aIds = await assignmentController.getAssignedCustomerIds(req.query.date as string, req.query.type as string)
        const data = {
          customers: await customerController.getAllCodes(),
          assigned: await customerController.getCodesByIds(aIds.map(a => a.cId!))
        }
        res.send(data)
      } else {
        if (!req.query.date) return res.status(400).send({ message: 'Incorrect format' })
        if (!req.query.type) return res.status(400).send({ message: 'Incorrect format' })
        if (['monthly', 'weekly'].indexOf(req.query.type as string) < 0) return res.status(400).send({ message: 'Incorrect format' })

        const validCustomers = await assignmentController.getCustomerIdsForUser(req.query.date as string, req.query.type as string, req.user!._id)
        const data = await customerController.getCodesByIds(validCustomers.map(a => a.cId!))
        res.send({
          customers: data,
          assigned: []
        })
      }
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.patch('/connectors',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    if (!req.body.customers?.length || !req.body.connectors?.length) {
      throw new Error("Incorrect parameter")
    }
    try {
      const connectors = await connectorController.findById(req.body.connectors)
      const customerNames = []
      for (let customerId of req.body.customers) {
        let customer = await customerController.getCustomerById(customerId)

        if (!customer) {
          throw new Error("Customer not found!")
        }
        customerNames.push(customer?.name)

        await customerController.updateCustomer(customer, {
          connectors: req.body.connectors
        })
      }

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has applied ${connectors?.map((c: any) => c.display_name.replaceAll(/_|-/g, " ")).join(', ')} connectors to ${customerNames.join(', ')} customers`
      })

      res.sendStatus(200)
    } catch (e: any) {
      // console.error(e)
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/:id',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let data = await customerController.getCustomerById(req.params.id)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.patch('/:id',
  auth,
  hasRole(ROLES.ADMIN),
  async (req: Request, res: Response) => {
    try {
      let user = await customerController.getCustomerById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
        throw err
      }
      const vData = await customerCreateValidationSchema.validate(req.body)
      await customerController.updateCustomer(user, vData)

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has updated ${user.name} customer`
      })

      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.delete('/:id',
  auth,
  hasRole(ROLES.ADMIN),
  async (req: Request, res: Response) => {
    try {
      let user = await customerController.getCustomerById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
        throw err
      }

      await customerController.deleteCustomer(user)

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has deleted ${user.name} customer`
      })
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.delete('/:id/permanent',
  auth,
  hasRole(ROLES.ADMIN),
  async (req: Request, res: Response) => {
    try {
      let user = await customerController.getCustomerById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
        throw err
      }

      if (user.status != -1) {
        throw new Error('This customer is not prepared for deletion!')
      }
      await customerController.deleteCustomerPermanently(user)

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has permanently deleted ${user.name} customer`
      })
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.post('/:id/restore',
  auth,
  hasRole(ROLES.ADMIN),
  async (req: Request, res: Response) => {
    try {
      let user = await customerController.getCustomerById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
        throw err
      }

      if (user.status != -1) {
        throw new Error('This customer is not prepared for deletion!')
      }
      await customerController.restore(user)

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has restored ${user.name} customer`
      })

      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/:id/dl',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      const data = {
        proposals: req.user?.role == ROLES.ADMIN ? await customerController.getDLChangeProposalsForCustomerId(req.params.id) : undefined,
        proposal: req.user?.role == ROLES.LEVEL3 ? await customerController.getDLChangeProposalByUser(req.params.id, req.user!._id) : undefined,
        customer: await customerController.getCustomerById(req.params.id)
      }
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.post('/:id/dl',
  auth,
  hasRole([ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      const customer = await customerController.getCustomerById(req.params.id)
      if (!customer) throw new Error('Customer info not found!')

      const existing = await customerController.getDLChangeProposalByUser(req.params.id, req.user!._id)

      const data = await dlChangeValidationSchema.validate(req.body)

      if (existing) {
        await customerController.updateDLProposal(existing._id.toString(), data)

        logger.info({
          msg: `${req.user?.fullname || req.user?.email} has updated dl proposal for ${customer.name} customer`
        })
      } else {
        await customerController.addDLProposal(req.params.id, req.user!._id, data)
        logger.info({
          msg: `${req.user?.fullname || req.user?.email} has added dl proposal for ${customer.name} customer`
        })
      }
      res.sendStatus(200)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.post('/:id/dl/:proposalId/accept',
  auth,
  hasRole([ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const customer = await customerController.getCustomerById(req.params.id)
      if (!customer) throw new Error('Customer info not found!')

      const proposal = await customerController.getDLChangeProposalById(req.params.proposalId)
      if (!proposal) throw new Error('Proposal not found!')

      await customerController.accepDLChangeProposal(proposal)

      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has accepted a dl change proposal for ${customer.name} customer`
      })
      res.sendStatus(200)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

export default router;
