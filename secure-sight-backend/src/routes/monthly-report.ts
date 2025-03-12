import { Router } from "express";
import { auth } from "../utils/auth-util";
import monthlyReportController from "../controllers/monthly-report.controller";
import { monthlyReportEditValidationSchema, monthlyReportValidationSchema } from "../validators/monthly-report.validator";

const router = Router()

router.get('/',
  auth,
  async (req, res) => {
    try {
      const doc = await monthlyReportController.getPaginated(req.query, req.user!);
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
      const data = await monthlyReportValidationSchema.validate(req.body)
      const doc = await monthlyReportController.save(data, req.user!);
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
      const doc = await monthlyReportController.getByIdForUser(req.params.id, req.user!);
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
      const doc = await monthlyReportController.getByIdForUser(req.params.id, req.user!);
      if (!doc) throw new Error("Report not found!")
      const data = await monthlyReportEditValidationSchema.validate(req.body)
      await monthlyReportController.update(doc, req.body)
      res.send(doc)
    } catch (e) {
      res.status(400).send(e)
    }
  }
)

export default router