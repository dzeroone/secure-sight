import { HydratedDocumentFromSchema, model, Schema, Types } from "mongoose"

const teamSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  uAt: Date
})

export type TeamDocumentType = HydratedDocumentFromSchema<typeof teamSchema>

export default model('Team', teamSchema)