import { Router } from "express";
import { auth, hasRole } from "../utils/auth-util";
import assignmentReportController from "../controllers/assignment-report.controller";
import { monthlyReportEditValidationSchema, monthlyReportValidationSchema } from "../validators/monthly-report.validator";
import { REPORT_AUDIT_STATUS, REPORT_DIR, REPORT_STATUS, ROLES } from "../constant";
import assignmentController, { ReportType } from "../controllers/assignment.controller";
import { weeklyReportEditValidationSchema, weeklyReportValidationSchema } from "../validators/weekly-report.validator";
import path from "path";
import { promises } from "fs";
import logger from "../utils/logger";
import userController from "../controllers/user.controller";

const router = Router()

router.get('/files/:fileName',
  async (req, res) => {
    try {
      await promises.stat(path.resolve(REPORT_DIR, req.params.fileName))
      res.sendFile(path.resolve(REPORT_DIR, req.params.fileName))
    }catch(e: any) {
      res.status(404).send({
        message: "File not found!"
      })
    }
  }
)

router.get('/approved',
  auth,
  hasRole(ROLES.LEVEL3),
  async (req, res) => {
    try {
      const data = await assignmentReportController.getApproved(req.query)
      res.json(data)
    }catch(e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

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
        if (!isLastReporter) {
          throw new Error("You are not allowed to submit the report!")
        }

        if (!req.body.submittedTo) {
          throw new Error("Report is submitted to none!")
        }

        const submittedTo = await userController.getUserById(req.body.submittedTo)
        if (!submittedTo) {
          throw new Error("Report is submitted to none!")
        }

        await assignmentController.reportSubmitted(assignment, doc._id.toString(), req.user!._id, req.body.submittedTo)
        
        logger.info({
          msg: `${req.user?.fullname || req.user?.email} has submitted report_index:${assignment.index} to ${submittedTo?.fullname || submittedTo?.email}`
        })
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
          const viewers = await assignmentController.getPermittedViewersByIndex(doc.index!, reportType)
          if (!viewers.includes(req.user!._id)) {
            throw new Error("You are not appropriate reporter")
          }
        } else {
          throw new Error("You are not appropriate reporter")
        }
      }

      let canSubmitReport = false
      const assignment = await assignmentController.getAssignmentByIndexForReporter(doc.index!, req.user!._id)
      if (assignment) {
        canSubmitReport = await assignmentController.isLastReporter(doc.index!, req.user!._id)
      }

      res.send({
        canSubmitReport,
        assignment: assignment,
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

        if (!assignment.sTo && !req.body.submittedTo) {
          throw new Error("Report is submitted to none.")
        }

        await assignmentController.reportSubmitted(assignment, doc._id.toString(), req.user!._id, req.body.submittedTo)
        await assignmentReportController.reportSubmitted(doc, data, reportType)

        const submittedTo = await userController.getUserById(req.body.submittedTo || assignment.sTo)

        logger.info({
          msg: `${req.user?.fullname || req.user?.email} has submitted report_index:${assignment.index} to ${submittedTo?.fullname || submittedTo?.email}`
        })
      }else{
        await assignmentReportController.update(doc, data, reportType)
        logger.info({
          msg: `${req.user?.fullname || req.user?.email} has updated report_index:${doc.index} data`
        })
      }

      res.send(doc)
    } catch (e: any) {
      res.status(400).json({
        message: e.message
      })
    }
  }
)

router.patch('/:reportType(monthly|weekly)/:id/archive',
  auth,
  hasRole(ROLES.LEVEL3),
  async (req, res) => {
    try {
      await assignmentReportController.reportApproved(
        req.params.id,
        req.params.reportType as ReportType,
        req.user!
      )
      res.send({
        success: true
      })
    }catch(e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)


export default router