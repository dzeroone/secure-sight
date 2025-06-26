import express from "express";
import { auth, hasRole } from "../utils/auth-util";
import { ROLES } from "../constant";
import activityLogController from "../controllers/activity-log.controller";
const router = express.Router();

export default router

router.get('/',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      const data = await activityLogController.getLogs(req.query)
      res.send(data)
    } catch (e: any) {
      console.log(e)
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get('/download',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      await activityLogController.downloadLogs(req.query, res)
    } catch (e: any) {
      console.log(e)
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)