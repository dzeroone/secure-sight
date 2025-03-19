import { HydratedDocumentFromSchema, model, Schema } from "mongoose"

const assignmentMessageSchema = new Schema({
  aId: {
    type: String,
    index: true
  }, // assignment id
  msg: String, // message
  sId: String, // sender id
  cAt: {
    type: Date,
    index: true
  }
})

export type AssignmentMessageDocumentType = HydratedDocumentFromSchema<typeof assignmentMessageSchema>

export default model('AssignmentMessage', assignmentMessageSchema)