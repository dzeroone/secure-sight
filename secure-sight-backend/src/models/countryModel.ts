import { HydratedDocumentFromSchema, model, Schema } from "mongoose"

const countrySchema = new Schema({
  title: String
})

export type CountryDocumentType = HydratedDocumentFromSchema<typeof countrySchema>

export default model('Country', countrySchema)