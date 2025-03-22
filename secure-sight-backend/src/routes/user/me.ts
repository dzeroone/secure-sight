import { Router } from "express"
import assignmentController from "../../controllers/assignment.controller"
import { auth } from "../../utils/auth-util"
import userController from "../../controllers/user.controller"

const router = Router()

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