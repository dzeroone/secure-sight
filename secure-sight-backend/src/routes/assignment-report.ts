import { Router } from "express";
import { auth } from "../utils/auth-util";
import assignmentReportController from "../controllers/assignment-report.controller";
import { monthlyReportEditValidationSchema, monthlyReportValidationSchema } from "../validators/monthly-report.validator";
import { REPORT_AUDIT_STATUS, REPORT_STATUS, ROLES } from "../constant";
import assignmentController, { ReportType } from "../controllers/assignment.controller";
import { weeklyReportEditValidationSchema, weeklyReportValidationSchema } from "../validators/weekly-report.validator";

const router = Router()

router.get('/:reportType(monthly|weekly)',
  auth,
  async (req, res) => {
    try {
      const doc = await assignmentReportController.getPaginated(req.query, req.user!, req.params.reportType as ReportType);
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

router.post('/:reportType(monthly|weekly)',
  auth,
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType

      const data = reportType == 'monthly' ? await monthlyReportValidationSchema.validate(req.body) : await weeklyReportValidationSchema.validate(req.body)

      const doc = await assignmentReportController.save(data, req.user!, reportType);
      if (req.body.status == REPORT_STATUS.SUBMIT) {
        const assignment = await assignmentController.getAssignmentByIndexForReporter(doc.index!, req.user!._id)
        if (!assignment) throw new Error("Assignment information not found")

        const isLastReporter = await assignmentController.isLastReporter(doc.index!, req.user!._id)
        if (!isLastReporter) throw new Error("You are not allowed to submit the report!")

        await assignmentController.reportSubmitted(assignment, doc._id.toString(), req.user!._id)
      }
      res.send(doc)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.get('/:reportType(monthly|weekly)/:id',
  auth,
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType

      const doc = await assignmentReportController.getById(req.params.id);
      if (!doc) throw new Error("Report not found!")

      if (doc.reporterId != req.user?._id.toString()) {
        if (doc.status == REPORT_STATUS.SUBMIT) {
          const assignees = await assignmentController.getAssigneesByIndex(doc.index!, reportType)
          if (!assignees.includes(req.user?._id)) {
            throw new Error("You are not appropriate reporter")
          }
        } else {
          throw new Error("You are not appropriate reporter")
        }
      }

      const canSubmitReport = await assignmentController.isLastReporter(doc.index!, req.user!._id)

      res.send({
        canSubmitReport,
        data: doc
      })
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.patch('/:reportType(monthly|weekly)/:id',
  auth,
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType

      const doc = await assignmentReportController.getById(req.params.id);
      if (!doc) throw new Error("Report not found!")
      if (doc.reporterId == req.user?._id.toString() && doc.status == REPORT_STATUS.SUBMIT) {
        throw new Error("This report is already submitted for review.")
      }
      if (doc.auditStatus && doc.auditStatus == REPORT_AUDIT_STATUS.APPROVED) {
        throw new Error("This report is already approved.")
      }

      const data = reportType == 'monthly' ? await monthlyReportEditValidationSchema.validate(req.body) : await weeklyReportEditValidationSchema.validate(req.body)

      if ((doc.status != REPORT_STATUS.SUBMIT) && (req.body.status == REPORT_STATUS.SUBMIT)) {
        const assignment = await assignmentController.getAssignmentByIndexForReporter(doc.index!, req.user!._id)
        if (!assignment) throw new Error("Assignment information not found")

        const isLastReporter = await assignmentController.isLastReporter(doc.index!, req.user!._id)
        if (!isLastReporter) throw new Error("You are not allowed to submit the report!")

        await assignmentController.reportSubmitted(assignment, doc._id.toString(), req.user!._id)
      }
      await assignmentReportController.update(doc, data, reportType)

      res.send(doc)
    } catch (e: any) {
      res.status(400).json({
        message: e.message
      })
    }
  }
)

export default router