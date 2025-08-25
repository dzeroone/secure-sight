import { HydratedDocumentFromSchema, model, Schema, Types } from "mongoose"

const passwordResetRequestSchema = new Schema({
  userId: Types.ObjectId,
  cAt: Date
})

export type PasswordResetRequestSchemaDocumentType = HydratedDocumentFromSchema<typeof passwordResetRequestSchema>

export default model('PasswordResetRequest', passwordResetRequestSchema)