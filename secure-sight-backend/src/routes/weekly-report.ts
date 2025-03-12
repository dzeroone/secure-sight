import { Router } from "express";
import { auth } from "../utils/auth-util";
import { weeklyReportEditValidationSchema, weeklyReportValidationSchema } from "../validators/weekly-report.validator";
import weeklyReportController from "../controllers/weekly-report.controller";

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
      const doc = await weeklyReportController.getByIdForUser(req.params.id, req.user!);
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

router.patch('/:id',
  auth,
  async (req, res) => {
    try {
      const doc = await weeklyReportController.getByIdForUser(req.params.id, req.user!);
      if (!doc) throw new Error("Report not found!")
      const data = await weeklyReportEditValidationSchema.validate(req.body)
      await weeklyReportController.update(doc, data)
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

export default router