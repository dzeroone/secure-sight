import { ROLES } from "../constant"
import notificationModel from "../models/notificationModel"

class NotificationController {
  async getNotificationsForUser(user: Express.User) {
    if (user.role == ROLES.ADMIN) {
      return notificationModel.find({
        tRole: ROLES.ADMIN
      }).sort({
        uAt: -1
      }).limit(20).lean()
    } else {
      return notificationModel.find({
        tId: user._id
      }).sort({
        uAt: -1
      }).limit(20).lean()
    }
  }

  async jobNotification(jobId: string, { title, message, status = 0 }: { title: string, message: string, status?: number }) {
    return notificationModel.findOneAndUpdate({
      relId: jobId
    }, {
      $set: {
        tRole: ROLES.ADMIN,
        title,
        message,
        status,
        uAt: new Date()
      }
    }, {
      upsert: true
    })
  }

  async notifyUser(userId: string, { title, message }: { title: string, message: string }) {
    const notification = new notificationModel({
      tId: userId,
      title,
      message,
      uAt: new Date()
    })
    return notification.save()
  }
}

export default new NotificationController()