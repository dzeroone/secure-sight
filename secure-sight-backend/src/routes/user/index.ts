import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import userController from '../../controllers/user.controller';

router.post('/',
  auth,
  hasRole("admin"),
  async (req: Request, res: Response) => {
    try {
      let data = await userController.addUser(req.body)
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
      let data = await userController.listUsers()
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/search',
  auth,
  hasRole("admin"),
  async (req: Request, res: Response) => {
    try {
      let data = await userController.search(req.query.search as string)
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
      let data = await userController.getUserById(req.params.id)
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
      let user = await userController.getUserById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
      }
      await userController.updateUser(user!, req.body)
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
