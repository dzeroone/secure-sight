import { Router } from "express";
import { auth, hasRole } from "../utils/auth-util";
import assignmentController from "../controllers/assignment.controller";
import { ROLES } from "../constant";
import { reportAssignmentValidationSchema } from "../validators/report-assignment.validator";
import userController from "../controllers/user.controller";
const router = Router();

router.delete('/:id',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    const assignment = await assignmentController.getById(req.params.id)
    if (!assignment) {
      return res.status(404).send({ message: 'Info not found!' })
    }
    if (req.user?._id.toString() != assignment.aBy) {
      return res.status(403).send({ message: 'You are not authorized' })
    }
    await assignmentController.deleteById(assignment._id.toString())
    res.sendStatus(204)
  }
)

router.get('/monthly',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    if (!req.query.date) return res.send([])
    const data = await assignmentController.getMonthlyAssignmentsForDate(req.query.date as string, req.user!._id)
    res.send(data)
  }
)

router.post('/monthly/assign',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    try {
      const body = await reportAssignmentValidationSchema.validate(req.body)
      if (req.user?.role == ROLES.ADMIN) {
        const reporter = await userController.getUserById(body.reporterId)
        if (!reporter) throw new Error("Reporter not found")

        if (reporter.role == ROLES.ADMIN) {
          throw new Error("You don't have permission to assign to this user")
        }

        const data = await assignmentController.assignMonthlyReport(body, req.user!._id)
        res.send(data)
        return
      } else if (req.user?.role == ROLES.LEVEL3 || req.user?.role == ROLES.LEVEL2) {
        const reporter = await userController.getUserById(body.reporterId)
        if (!reporter) throw new Error("Reporter not found")

        if (req.user.role == ROLES.LEVEL3 && [ROLES.LEVEL2, ROLES.LEVEL1].indexOf(reporter.role) < 0) {
          throw new Error("You don't have permission to assign to this user")
        } else if (req.user.role == ROLES.LEVEL2 && reporter.role != ROLES.LEVEL1) {
          throw new Error("You don't have permission to assign to this user")
        }

        const data = await assignmentController.assignMonthlyReport(body, req.user!._id)
        res.send(data)
        return
      }
      throw new Error("Haven't assigned the report")
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

export default router