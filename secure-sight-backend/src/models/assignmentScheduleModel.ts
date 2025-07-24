import { HydratedDocumentFromSchema, model, Schema, Types } from "mongoose"
import { COLLECTIONS } from "../constant"

const assignmentScheduleSchema = new Schema({
  rType: String,
  cId: {
    type: Types.ObjectId,
    ref: COLLECTIONS.CUSTOMERS
  },
  uId: {
    type: Types.ObjectId,
    ref: COLLECTIONS.USERS
  },
  cAt: Date,
  uAt: Date
})

export type AssignmentScheduleDocumentType = HydratedDocumentFromSchema<typeof assignmentScheduleSchema>

export default model('AssignmentSchedule', assignmentScheduleSchema)