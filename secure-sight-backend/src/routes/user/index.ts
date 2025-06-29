import express, { Request, Response } from 'express'
const router = express.Router();
import { auth, hasRole } from '../../utils/auth-util';
import userController from '../../controllers/user.controller';
import { ROLES } from '../../constant';
import meRouter from './me'
import assignmentController from '../../controllers/assignment.controller';
import logger from '../../utils/logger';

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
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has added a user`
      })
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

router.get('/deleted',
  auth,
  hasRole([ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      let data = await userController.listDeletedUsers()
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

router.post('/transfer-admin',
  auth,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    try {
      if (!req.body.userId || (req.body.userId == req.user?._id)) {
        throw new Error('Incorrect parameter')
      }

      const userInfo = await userController.getUserById(req.body.userId)
      if(!userInfo) {
        throw new Error("User info not found")
      }

      await userController.transferAdmin(req.user!._id, req.body.userId)
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has transfered admin role to ${userInfo.email}`
      })
      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
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
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has modified team assignment`
      })
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
      // if (req.user?.role == ROLES.LEVEL3) {
      //   let data = await userController.getUserByIdAndRole(req.params.id, [ROLES.LEVEL2, ROLES.LEVEL1])
      //   res.send(data)
      //   return
      // }
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
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has modified ${user?.email} user's data`
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
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has deleted ${user?.email} user's data`
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

router.get('/:id/pending-assignments',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let data = await assignmentController.getPendingAssignmentsForUser(req.params.id)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.get('/:id/transfer-suggestions',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3]),
  async (req: Request, res: Response) => {
    try {
      let data = await userController.getTransferSuggestions(req.params.id)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.post('/:id/restore',
  auth,
  hasRole([ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      let user = await userController.getUserById(req.params.id)
      if (!user) {
        const err: any = new Error("Info not found!")
        err.status = 404
      }
      await userController.restoreUser(user!)
      logger.info({
        msg: `${req.user?.fullname || req.user?.email} has restored ${user?.email} user`
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

router.use('/me', meRouter)

export default router;
