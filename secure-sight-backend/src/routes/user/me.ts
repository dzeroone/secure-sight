import { Router } from "express"
import assignmentController from "../../controllers/assignment.controller"
import { auth } from "../../utils/auth-util"
import userController from "../../controllers/user.controller"
import teamController from "../../controllers/team.controller"

const router = Router()

router.get('/',
  auth,
  async (req, res) => {
    try {
      let data = await userController.getUserById(req.user!._id).lean()
      if(data?.team) {
        data.team = await teamController.getById(data.team)
      }
      res.send(data)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.patch('/',
  auth,
  async (req, res) => {
    try {
      let data = await userController.getUserById(req.user!._id)
      if(!data) {
        throw new Error("Invalid")
      }
      await userController.updateUser(data, {
        fullname: req.body.fullname,
        email: req.body.email,
        contact: req.body.contact
      })
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.patch('/change-password',
  auth,
  async (req, res) => {
    try {
      let data = await userController.findOneByEmail(req.user!.email)
      if(!data) {
        throw new Error("Invalid")
      }
      await userController.changePassword(data, req.body)
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get('/dashboard',
  auth,
  async (req, res) => {
    try {
      const data = await userController.getDashboardDataForUser(req.user!)
      res.send(data)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get('/monthly-assignments',
  auth,
  async (req, res) => {
    const data = await assignmentController.getMonthlyAssignmentsForUser(req.user!)
    res.send(data)
  }
)

router.get('/weekly-assignments',
  auth,
  async (req, res) => {
    const data = await assignmentController.getWeeklyAssignmentsForUser(req.user!)
    res.send(data)
  }
)

export default router