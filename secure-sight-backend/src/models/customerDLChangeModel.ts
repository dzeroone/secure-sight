import { HydratedDocumentFromSchema, model, Schema, Types } from "mongoose"
const ObjectId = Types.ObjectId

const customerDLChangeSchema = new Schema({
  cId: {
    type: String,
    index: true
  },
  uId: {
    type: String,
    index: true
  },
  emails: {
    type: new Schema({
      to: String,
      cc: String
    }),
    default: {
      to: '',
      cc: ''
    }
  },
  cAt: Date,
  uAt: Date
})

export type CustomerDLChangeDocumentType = HydratedDocumentFromSchema<typeof customerDLChangeSchema>

export default model('dlChange', customerDLChangeSchema)