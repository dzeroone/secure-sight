import { HydratedDocumentFromSchema, model, Schema } from "mongoose"

const dbSchema = new Schema({
  index: String,
  data: Schema.Types.Mixed,
  comment: String,
  reporterId: {
    type: String,
    index: true
  },
  fileName: String,
  status: Number,
  auditStatus: Number,
  cAt: Date,
  uAt: Date
})

export type AssignmentReportDocumentType = HydratedDocumentFromSchema<typeof dbSchema>

export default model('assignmentReport', dbSchema)