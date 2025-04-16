import { Router } from "express";
import { REPORT_AUDIT_STATUS, REPORT_STATUS, ROLES } from "../constant";
import assignmentReportController from "../controllers/assignment-report.controller";
import assignmentController, { ReportType } from "../controllers/assignment.controller";
import userController from "../controllers/user.controller";
import { auth, hasRole } from "../utils/auth-util";
import { reportAssignmentValidationSchema } from "../validators/report-assignment.validator";
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

    await assignmentController.delete(assignment)
    res.sendStatus(204)
  }
)

router.get('/:id/messages',
  auth,
  async (req, res) => {
    try {
      const data = await assignmentController.getById(req.params.id)
      if (!data) {
        const err: any = new Error("Assignment not found")
        err.status = 404
        throw err
      }
      if (data.aBy != req.user?._id && data.reporterId != req.user?._id) {
        const err: any = new Error("You are not authorized!")
        throw err
      }
      const dataWithParticipentAndMessages = {
        info: {
          date: data.date,
          rType: data.rType,
          lastSeen: data.aBy == req.user?._id ? data.aMLS : data.rMLS,
          customer: await assignmentController.getCustomerInfo(data.cId!),
          assignee: await assignmentController.getUserInfo(data.aBy!),
          reporter: await assignmentController.getUserInfo(data.reporterId!)
        },
        messages: await assignmentController.getMessages(req.params.id)
      }
      res.send(dataWithParticipentAndMessages)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.post('/:id/messages',
  auth,
  async (req, res) => {
    try {
      const data = await assignmentController.getById(req.params.id)
      if (!data) {
        const err: any = new Error("Assignment not found")
        err.status = 404
        throw err
      }
      if (data.aBy != req.user?._id && data.reporterId != req.user?._id) {
        const err: any = new Error("You are not authorized!")
        throw err
      }
      const message = req.body.message.trim()
      if (message)
        await assignmentController.saveMessage(req.params.id, req.user!._id, message)
      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get('/:id/suggest-reporters',
  auth,
  async (req, res) => {
    try {
      const assignment = await assignmentController.getById(req.params.id)
      if (!assignment) {
        throw new Error("Assignment not found!")
      }
      const users = await userController.getSameLevelUsers(assignment.aBy!)
      res.send(users)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get('/:reportType(monthly|weekly)',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    if (!req.query.date) return res.send([])

    const reportType = req.params.reportType as ReportType

    if (ROLES.LEVEL2 == req.user?.role) {
      const data = await assignmentController.getAssignmentsForDateForReporter(req.query.date as string, req.user!._id, reportType)
      res.send(data)
      return
    }
    const data = await assignmentController.getCustomerWithAssignmentsForDate(req.query.date as string, req.user!._id, reportType)
    res.send(data)
  }
)

router.post('/:reportType(monthly|weekly)/assign',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType

      const body = await reportAssignmentValidationSchema.validate(req.body)
      if (req.user?.role == ROLES.ADMIN) {
        const reporter = await userController.getUserById(body.reporterId)
        if (!reporter) throw new Error("Reporter not found")

        if (reporter.role == ROLES.ADMIN) {
          throw new Error("You don't have permission to assign to this user")
        }

        const data = await assignmentController.assignReport(body, req.user!._id, reportType)
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

        const data = await assignmentController.assignReport(body, req.user!._id, reportType)
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

router.get('/submissions/:reportType(monthly|weekly)',
  auth,
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType
      const data = await assignmentController.getSubmissions(req.user!, reportType)
      res.send(data)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.post('/submissions/:id/reaudit',
  auth,
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType
      const assignment = await assignmentController.getAssignmentByReportIdForAuditer(req.params.id, req.user!._id)
      if (!assignment) {
        throw new Error("Assignment not found")
      }
      const report = await assignmentReportController.getById(req.params.id)
      if (!report) {
        throw new Error("Report not found")
      }
      if (report.auditStatus && report.auditStatus == REPORT_AUDIT_STATUS.APPROVED) {
        throw new Error("Report is already approved")
      }

      await assignmentController.updateById(assignment._id.toString(), {
        status: REPORT_AUDIT_STATUS.AUDIT,
        sCBy: req.user!._id
      })

      // if has leaf reporter who assigned this report to some other person then
      // don't flag report to DRAFT mode, because draft mode disables assignees to view the report
      const lAssignment = await assignmentController.getAssignmentByReportIdForAuditer(req.params.id, assignment.sBy!)
      if (lAssignment) {
        await assignmentController.updateById(lAssignment._id.toString(), {
          status: REPORT_AUDIT_STATUS.AUDIT,
          sCBy: req.user!._id
        })
      } else {
        await assignmentReportController.updateById(report._id.toString(), {
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

router.post('/submissions/:id/approve',
  auth,
  async (req, res) => {
    try {
      const assignment = await assignmentController.getAssignmentByReportIdForAuditer(req.params.id, req.user!._id)
      if (!assignment) {
        throw new Error("Assignment not found")
      }
      const report = await assignmentReportController.getById(req.params.id)
      if (!report) {
        throw new Error("Report not found")
      }

      if (report.auditStatus && report.auditStatus == REPORT_AUDIT_STATUS.APPROVED) {
        throw new Error("Report is already approved")
      }

      // get upper assignment if exists
      const uAssignment = await assignmentController.getAssignmentByIndexForReporter(assignment.index!, assignment.aBy!)
      if (uAssignment) {
        if (!req.body.submittedTo) {
          throw new Error("Report is submitted to none.")
        }
        await assignmentController.updateById(assignment._id.toString(), {
          status: REPORT_AUDIT_STATUS.PENDING,
          sCBy: req.user!._id
        })
        await assignmentController.reportSubmitted(uAssignment, report._id.toString(), req.user!._id, req.body.submittedTo)
      } else {
        // most top level user approved the report, so approve all leaf reporter's reports
        await assignmentController.reportApproved(assignment, report._id.toString(), req.user!)
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