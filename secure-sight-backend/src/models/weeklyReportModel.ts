import { model, Schema, Types } from "mongoose"
const ObjectId = Types.ObjectId

const dbSchema = new Schema({
  index: String,
  data: Schema.Types.Mixed,
  comment: String,
  reporterId: {
    type: String,
    index: true
  },
  status: Number,
  cAt: Date,
  uAt: Date
})

export default model('weeklyReport', dbSchema)