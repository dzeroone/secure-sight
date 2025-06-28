import countryModel from "../models/countryModel"

class CountryController {
  async getAll() {
    return countryModel.find().lean()
  }

  async add(data: {title: string}) {
    const c = new countryModel(data)
    return c.save()
  }

  async edit(id: string, data: {title: string}) {
    const c = await countryModel.findById(id)
    if(!c) throw new Error("invalid")
    return c.updateOne({
      $set: data
    })
  }

  async delete(id: string) {
    const c = await countryModel.findById(id)
    if(!c) throw new Error("invalid")
    return c.deleteOne()
  }
}

export default new CountryController()