import commonDataModel from "../models/commonDataModel"
import { CommonDataValidationValues } from "../validators/common-data.validator"
import { ReportType } from "./assignment.controller"

class CommonDataController {
  async get(rType: ReportType) {
    return commonDataModel.findOne({
      rType
    })
  }

  async update(data: CommonDataValidationValues, rType: ReportType, user: Express.User) {
    let doc = await this.get(rType)
    if (!doc) {
      doc = new commonDataModel({
        rType,
        ...data,
        uAt: new Date(),
        uBy: user._id
      })
      return doc.save()
    }
    return doc.update({
      $set: {
        ...data,
        uAt: new Date(),
        uBy: user._id
      }
    })
  }
}

export default new CommonDataController()