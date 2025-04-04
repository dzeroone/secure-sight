import { HydratedDocumentFromSchema, model, Schema, Types } from "mongoose"

const assignmentSchema = new Schema({
  rType: String,
  date: {
    type: String,
    index: true
  },
  index: String,
  cId: { // customer id
    type: String,
    index: true
  },
  aBy: { // assigned by
    type: String,
    index: true
  },
  reporterId: {
    type: String,
    index: true
  },
  reportId: {
    type: String
  },
  status: Number,
  sCBy: String, // status changed by
  aMLS: Date, // assignee message last seen
  rMLS: Date, // reporter message last seen
  cAt: Date,
  uAt: Date
})

export type AssignmentDocumentType = HydratedDocumentFromSchema<typeof assignmentSchema>

export default model('Assignment', assignmentSchema)