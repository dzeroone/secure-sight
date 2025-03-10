import { Router } from "express"
import { auth, hasRole } from "../../utils/auth-util"
import { ROLES } from "../../constant"
import assignmentController from "../../controllers/assignment.controller"

const router = Router()

router.get('/monthly-assignments',
  auth,
  async (req, res) => {
    const data = await assignmentController.getMonthlyAssignmentsForUser(req.user!)
    res.send(data)
  }
)

export default router