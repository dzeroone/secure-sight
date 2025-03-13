import { Router } from "express";
import { auth } from "../utils/auth-util";
import { weeklyReportEditValidationSchema, weeklyReportValidationSchema } from "../validators/weekly-report.validator";
import weeklyReportController from "../controllers/weekly-report.controller";
import { REPORT_STATUS } from "../constant";
import assignmentController from "../controllers/assignment.controller";

const router = Router()

router.get('/',
  auth,
  async (req, res) => {
    try {
      const doc = await weeklyReportController.getPaginated(req.query, req.user!);
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

router.post('/',
  auth,
  async (req, res) => {
    try {
      const data = await weeklyReportValidationSchema.validate(req.body)
      const doc = await weeklyReportController.save(data, req.user!);
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

router.get('/:id',
  auth,
  async (req, res) => {
    try {
      const doc = await weeklyReportController.getById(req.params.id);
      if (!doc) throw new Error("Report not found!")

      if (doc.reporterId != req.user?._id.toString()) {
        if (doc.status == REPORT_STATUS.SUBMIT) {
          const assignees = await assignmentController.getAssigneesForReport(doc.index!, 'weekly')
          if (!assignees.includes(req.user?._id)) {
            throw new Error("You are not appropriate reporter")
          }
        } else {
          throw new Error("You are not appropriate reporter")
        }
      }
      res.send(doc)
    } catch (e: any) {
      res.status(400).send({
        message: e.message
      })
    }
  }
)

router.patch('/:id',
  auth,
  async (req, res) => {
    try {
      const doc = await weeklyReportController.getById(req.params.id);
      if (!doc) throw new Error("Report not found!")
      if (doc.reporterId != req.user?._id.toString()) {
        throw new Error("You are not appropriate reporter")
      }
      if (doc.status == REPORT_STATUS.SUBMIT) {
        throw new Error("This report is already submitted for review.")
      }


      const data = await weeklyReportEditValidationSchema.validate(req.body)
      if (req.body.status == REPORT_STATUS.SUBMIT) {
        const assignment = await assignmentController.getAssignmentForReport(doc.index!, req.user!._id, 'weekly')
        if (!assignment) throw new Error("Assignment information not found")

        await assignmentController.reportSubmitted(assignment, doc._id.toString())
      }
      await weeklyReportController.update(doc, data)

      res.send(doc)
    } catch (e: any) {
      res.status(400).json({
        message: e.message
      })
    }
  }
)

export default router