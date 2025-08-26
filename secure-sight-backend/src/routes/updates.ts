import express from 'express';
import notificationController from '../controllers/notification.controller';
import { auth } from '../utils/auth-util';
import authController from '../controllers/authController';
const router = express.Router();

router.get('/',
  auth,
  async (req, res) => {
    return res.json({
      notifications: await notificationController.getNotificationsForUser(req.user!),
      passwordResets: await authController.getPasswordResetRequests(req.user!)
    })
  }
)

export default router