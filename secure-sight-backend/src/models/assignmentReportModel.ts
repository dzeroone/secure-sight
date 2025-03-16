import { HydratedDocumentFromSchema, InferSchemaType, model, Schema, Types } from "mongoose"
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
  auditStatus: Number,
  cAt: Date,
  uAt: Date
})

export type AssignmentReportDocumentType = HydratedDocumentFromSchema<typeof dbSchema>

export default model('assignmentReport', dbSchema)