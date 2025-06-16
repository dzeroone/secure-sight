import { Router } from "express";
import commonDataController from "../controllers/common-data.controller";
import { auth, hasRole } from "../utils/auth-util";
import { ROLES } from "../constant";
import { commonDataValidationSchema, weeklyCommonDataValidationSchema } from "../validators/common-data.validator";
import { ReportType } from "../controllers/assignment.controller";
import logger from "../utils/logger";

const router = Router()

router.get('/:reportType(monthly|weekly)',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType
      const data = await commonDataController.get(reportType)
      res.send(data)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  })

router.post('/:reportType(monthly|weekly)',
  auth,
  hasRole([ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2]),
  async (req, res) => {
    try {
      const reportType = req.params.reportType as ReportType
      const data = reportType == 'monthly' ? await commonDataValidationSchema.validate(req.body) : await weeklyCommonDataValidationSchema.validate(req.body)
      await commonDataController.update(data, reportType, req.user!)
      logger.info({
        msg: `${req.user?.email} has updated ${reportType} common data`
      })
      res.send({
        success: true
      })
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  })

export default router