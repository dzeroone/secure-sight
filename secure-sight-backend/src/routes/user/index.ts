import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import userController from '../../controllers/user.controller';
import { ROLES } from '../../constant';
import meRouter from './me'

router.post('/',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      if (req.user?.role == ROLES.LEVEL3) {
        if (![ROLES.LEVEL2, ROLES.LEVEL1].includes(req.body.role)) {
          throw new Error('Provided role is not permitted!')
        }
      }
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
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      if (req.user?.role == ROLES.LEVEL3) {
        let data = await userController.listUsersByRole([ROLES.LEVEL2, ROLES.LEVEL1])
        res.send(data)
        return
      }
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
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req: Request, res: Response) => {
    try {
      let data = await userController.search(req.query.search as string, req.query.index as string, req.user!)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.patch('/team-assign',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req, res) => {
    try {
      await userController.assignTeam(req.body)
      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
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
      if (req.user?.role == ROLES.LEVEL3) {
        let data = await userController.getUserByIdAndRole(req.params.id, [ROLES.LEVEL2, ROLES.LEVEL1])
        res.send(data)
        return
      }
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
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let user = null
      if (req.user?.role == ROLES.LEVEL3) {
        user = await userController.getUserByIdAndRole(req.params.id, [ROLES.LEVEL2, ROLES.LEVEL1])
      } else {
        user = await userController.getUserById(req.params.id)
      }
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
      }
      if (req.user?.role == ROLES.LEVEL3) {
        if (![ROLES.LEVEL2, ROLES.LEVEL1].includes(req.body.role)) {
          throw new Error('Provided role is not permitted!')
        }
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

router.delete('/:id',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let user = null
      if (req.user?.role == ROLES.LEVEL3) {
        user = await userController.getUserByIdAndRole(req.params.id, [ROLES.LEVEL2, ROLES.LEVEL1])
      } else {
        user = await userController.getUserById(req.params.id)
      }
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
      }
      await userController.deleteUser(user!)
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

router.use('/me', meRouter)

export default router;
