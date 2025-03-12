import { REPORT_STATUS } from "../constant"
import monthlyReportModel from "../models/monthlyReportModel"
import { MonthlyReportEditValidationValues, MonthlyReportValidationValues } from "../validators/monthly-report.validator"

class MonthlyReportController {
  async getPaginated(query: any, user: Express.User) {
    const pageNumber = Number(query.page) || 1
    const filterQuery = {
      reporterId: user._id,
      $or: [
        {
          'data.monthly_report.doc_title': new RegExp(`^${query.search}`, "si")
        },
        {
          'data.monthly_report.client_name': new RegExp(`${query.search}`, "si")
        },
        {
          'data.monthly_report.customer_name': new RegExp(`${query.search}`, "si")
        },
        {
          'data.monthly_report.date': new RegExp(`${query.search}`, "si")
        }
      ]
    }
    const count = await monthlyReportModel.countDocuments(filterQuery)
    const data = await monthlyReportModel.find(filterQuery).limit(20).skip((pageNumber - 1) * 20).lean()
    return { count, data }
  }
  async save(data: MonthlyReportValidationValues, user: Express.User) {
    const doc = new monthlyReportModel({
      index: data.index,
      data: data.report,
      reporterId: user._id,
      comment: data.comment,
      status: REPORT_STATUS.DRAFT,
      cAt: new Date(),
      uAt: new Date()
    })
    return doc.save()
  }

  async update(doc: any, data: MonthlyReportEditValidationValues) {
    return doc.updateOne({
      $set: {
        data: data.report,
        uAt: new Date()
      }
    })
  }

  async getByIdForUser(id: string, user: Express.User) {
    return monthlyReportModel.findOne({
      _id: id,
      reporterId: user._id
    })
  }
}

export default new MonthlyReportController()