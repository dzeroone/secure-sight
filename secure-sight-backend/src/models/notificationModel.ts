import { model, Schema, Types } from "mongoose"

const notificationSchema = new Schema({
  relId: {
    type: String,
    index: true
  },
  tId: {
    type: String,
    index: true
  },
  tRole: {
    type: String,
    index: true
  },
  title: String,
  message: String,
  status: Number, // -1 for error
  uAt: Date
})

export default model('Notification', notificationSchema)