import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import customerController from '../../controllers/customer.controller';
import { customerCreateValidationSchema } from '../../validators/customer-create.validator';

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
