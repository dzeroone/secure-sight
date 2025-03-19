import { HydratedDocumentFromSchema, InferSchemaType, Model, model, Schema, Types } from "mongoose"
const ObjectId = Types.ObjectId

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
  aMLS: Date, // assignee message last seen
  rMLS: Date, // reporter message last seen
  status: Number,
  sCBy: String, // status changed by
  cAt: Date,
  uAt: Date
})

export type AssignmentDocumentType = HydratedDocumentFromSchema<typeof assignmentSchema>

export default model('Assignment', assignmentSchema)