import { model, Schema, Types } from "mongoose"
const ObjectId = Types.ObjectId

const notificationSchema = new Schema({
  relId: {
    type: String,
    index: true
  },
  title: String,
  message: String,
  status: Number, // -1 for error
  updatedAt: Date
})

export default model('Notification', notificationSchema)