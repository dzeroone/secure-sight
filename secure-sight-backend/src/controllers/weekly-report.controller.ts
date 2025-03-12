import { REPORT_STATUS } from "../constant"
import weeklyReportModel from "../models/weeklyReportModel"
import { WeeklyReportEditValidationValues, WeeklyReportValidationValues } from "../validators/weekly-report.validator"

class WeeklyReportController {
  async getPaginated(query: any, user: Express.User) {
    const pageNumber = Number(query.page) || 1
    const filterQuery = {
      reporterId: user._id,
      $or: [
        {
          'data.formData.client.clientName': new RegExp(`^${query.search}`, "si")
        },
        {
          'data.reportData.WEEKLY_REPORT.start_date': new RegExp(`${query.search}`, "si")
        },
        {
          'data.reportData.WEEKLY_REPORT.end_date': new RegExp(`${query.search}`, "si")
        }
      ]
    }
    const count = await weeklyReportModel.countDocuments(filterQuery)
    const data = await weeklyReportModel.find(filterQuery).limit(20).skip((pageNumber - 1) * 20).lean()
    return { count, data }
  }
  async save(data: WeeklyReportValidationValues, user: Express.User) {
    const doc = new weeklyReportModel({
      index: data.index,
      data: { formData: data.formData, reportData: data.reportData },
      reporterId: user._id,
      comment: data.comment,
      status: REPORT_STATUS.DRAFT,
      cAt: new Date(),
      uAt: new Date()
    })
    return doc.save()
  }

  async update(doc: any, data: WeeklyReportEditValidationValues) {
    return doc.updateOne({
      $set: {
        data: { formData: data.formData, reportData: data.reportData },
        uAt: new Date()
      }
    })
  }

  async getByIdForUser(id: string, user: Express.User) {
    return weeklyReportModel.findOne({
      _id: id,
      reporterId: user._id
    })
  }
}

export default new WeeklyReportController()