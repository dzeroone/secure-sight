import { Router } from "express";
import { auth, hasRole } from "../utils/auth-util";
import assignmentController from "../controllers/assignment.controller";
import { REPORT_AUDIT_STATUS, REPORT_STATUS, ROLES } from "../constant";
import { reportAssignmentValidationSchema } from "../validators/report-assignment.validator";
import userController from "../controllers/user.controller";
import monthlyReportController from "../controllers/monthly-report.controller";
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
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    if (!req.query.date) return res.send([])

    if (ROLES.LEVEL2 == req.user?.role) {
      const data = await assignmentController.getMonthlyAssignmentsForDateForUser(req.query.date as string, req.user!._id)
      res.send(data)
      return
    }
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

router.get('/weekly',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    if (!req.query.date) return res.send([])

    if (ROLES.LEVEL2 == req.user?.role) {
      const data = await assignmentController.getWeeklyAssignmentsForDateForUser(req.query.date as string, req.user!._id)
      res.send(data)
      return
    }
    const data = await assignmentController.getWeeklyAssignmentsForDate(req.query.date as string, req.user!._id)
    res.send(data)
  }
)

router.post('/weekly/assign',
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

        const data = await assignmentController.assignWeeklyReport(body, req.user!._id)
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

        const data = await assignmentController.assignWeeklyReport(body, req.user!._id)
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

router.get('/monthly-submissions',
  auth,
  async (req, res) => {
    try {
      const data = await assignmentController.getMonthlySubmissions(req.user!)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.post('/monthly-submissions/:id/reaudit',
  auth,
  async (req, res) => {
    try {
      const assignment = await assignmentController.getMonthlyAssignmentByReportIdForAssignee(req.params.id, req.user!._id)
      if (!assignment) {
        throw new Error("Assignment not found")
      }
      const report = await monthlyReportController.getById(req.params.id)
      if (!report) {
        throw new Error("Report not found")
      }

      await assignmentController.updateById(assignment._id.toString(), {
        status: REPORT_AUDIT_STATUS.AUDIT
      })

      // if has leaf reporter who assigned this report to some other persion then
      // don't flag report to DRAFT mode, because draft mode disables assignees to view the report
      const lAssignment = await assignmentController.getMonthlyAssignmentByReportIdForAssignee(req.params.id, assignment.reporterId!)
      if (lAssignment) {
        await assignmentController.updateById(lAssignment._id.toString(), {
          status: REPORT_AUDIT_STATUS.AUDIT
        })
      } else {
        await monthlyReportController.updateById(report._id.toString(), {
          status: REPORT_STATUS.DRAFT,
          auditStatus: REPORT_AUDIT_STATUS.AUDIT
        })
      }
      res.sendStatus(201)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.post('/monthly-submissions/:id/approve',
  auth,
  async (req, res) => {
    try {
      const assignment = await assignmentController.getMonthlyAssignmentByReportIdForAssignee(req.params.id, req.user!._id)
      if (!assignment) {
        throw new Error("Assignment not found")
      }
      const report = await monthlyReportController.getById(req.params.id)
      if (!report) {
        throw new Error("Report not found")
      }

      // get upper assignment if exists
      const uAssignment = await assignmentController.getAssignmentForReport(assignment.index!, req.user!._id, 'monthly')
      if (uAssignment) {
        await assignmentController.updateById(assignment._id.toString(), {
          status: REPORT_AUDIT_STATUS.PENDING
        })
        await assignmentController.reportSubmitted(uAssignment, report._id.toString())
      } else {
        // most top level user approved the report, so approve all leaf reporter's reports
        await assignmentController.updateById(assignment._id.toString(), {
          status: REPORT_AUDIT_STATUS.APPROVED
        })

        let lAssignment = await assignmentController.getMonthlyAssignmentByReportIdForAssignee(req.params.id, assignment.reporterId!)
        while (lAssignment) {
          await assignmentController.updateById(lAssignment._id.toString(), {
            status: REPORT_AUDIT_STATUS.APPROVED
          })
          lAssignment = await assignmentController.getMonthlyAssignmentByReportIdForAssignee(req.params.id, lAssignment.reporterId!)
        }

        await monthlyReportController.updateById(report._id.toString(), {
          auditStatus: REPORT_AUDIT_STATUS.APPROVED
        })
      }
      res.sendStatus(201)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

export default router