import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import customerController from '../../controllers/customer.controller';
import { customerCreateValidationSchema } from '../../validators/customer-create.validator';
import { ROLES } from '../../constant';
import assignmentController from '../../controllers/assignment.controller';

router.post('/',
  auth,
  hasRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const vData = await customerCreateValidationSchema.validate(req.body)
      let data = await customerController.addCustomer(vData)
      res.send(data)
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
  hasRole("admin"),
  async (req: Request, res: Response) => {
    try {
      let data = await customerController.listCustomers()
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
      if (req.user?.role == ROLES.ADMIN) {
        const data = await customerController.getAllCodes()
        res.send(data)
      } else {
        if (!req.query.date) return res.status(400).send({ message: 'Incorrect format' })
        if (!req.query.type) return res.status(400).send({ message: 'Incorrect format' })
        if (['monthly', 'weekly'].indexOf(req.query.type as string) < 0) return res.status(400).send({ message: 'Incorrect format' })

        const validCustomers = await assignmentController.getCustomerIdsForUser(req.query.date as string, req.query.type as string, req.user!._id)
        const data = await customerController.getCodesByIds(validCustomers.map(a => a.cId!))
        res.send(data)
      }
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/:id',
  auth,
  hasRole("admin"),
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
  hasRole("admin"),
  async (req: Request, res: Response) => {
    try {
      let user = await customerController.getCustomerById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
      }
      await customerController.updateCustomer(user!, req.body)
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

router.patch(':/id',)

export default router;
