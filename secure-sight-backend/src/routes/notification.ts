import express from 'express'
import notificationModel from '../models/notificationModel';
import notificationController from '../controllers/notification.controller';
import { auth } from '../utils/auth-util';
const router = express.Router();

router.get('/',
  auth,
  async (req, res) => {
    const data = await notificationController.getNotificationsForUser(req.user!)
    return res.json(data)
  }
)

export default router