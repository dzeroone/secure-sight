import assignmentReportModel, { AssignmentReportDocumentType } from "../models/assignmentReportModel"
import { MonthlyReportEditValidationValues, MonthlyReportValidationValues } from "../validators/monthly-report.validator"
import { WeeklyReportEditValidationValues, WeeklyReportValidationValues } from "../validators/weekly-report.validator"
import { ReportType } from "./assignment.controller"

class AssignmentReportController {
  async getPaginated(query: any, user: Express.User, reportType: ReportType) {
    const pageNumber = Number(query.page) || 1
    let filterQuery: any = {}

    switch (reportType) {
      case 'monthly':
        filterQuery = {
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
        break;
      case 'weekly':
        filterQuery = {
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
        break;
    }
    const count = await assignmentReportModel.countDocuments(filterQuery)
    const data = await assignmentReportModel.find(filterQuery).limit(20).skip((pageNumber - 1) * 20).lean()
    return { count, data }
  }
  async save(data: MonthlyReportValidationValues | WeeklyReportValidationValues, user: Express.User, reportType: ReportType) {
    if (reportType == 'monthly') {
      data = data as MonthlyReportValidationValues
      const doc = new assignmentReportModel({
        index: data.index,
        data: data.report,
        reporterId: user._id,
        comment: data.comment,
        status: data.status,
        cAt: new Date(),
        uAt: new Date()
      })
      return doc.save()
    }
    else {
      data = data as WeeklyReportValidationValues
      const doc = new assignmentReportModel({
        index: data.index,
        data: { formData: data.formData, reportData: data.reportData },
        reporterId: user._id,
        comment: data.comment,
        status: data.status,
        cAt: new Date(),
        uAt: new Date()
      })
      return doc.save()
    }
  }

  async update(doc: AssignmentReportDocumentType, data: MonthlyReportEditValidationValues | WeeklyReportEditValidationValues, reportType: ReportType) {
    if (reportType == 'monthly') {
      data = data as MonthlyReportEditValidationValues
      return doc.updateOne({
        $set: {
          data: data.report,
          status: data.status,
          uAt: new Date()
        }
      })
    } else {
      data = data as WeeklyReportEditValidationValues
      doc.updateOne({
        $set: {
          data: { formData: data.formData, reportData: data.reportData },
          status: data.status,
          uAt: new Date()
        }
      })
    }
  }

  async updateById(id: string, data: any) {
    return assignmentReportModel.updateOne({
      _id: id
    }, {
      $set: data
    })
  }

  async getById(id: string) {
    return assignmentReportModel.findOne({
      _id: id
    })
  }

  async deleteById(id: string) {
    return assignmentReportModel.deleteOne({
      _id: id
    })
  }

  async getByIdForUser(id: string, user: Express.User) {
    return assignmentReportModel.findOne({
      _id: id,
      reporterId: user._id
    })
  }
}

export default new AssignmentReportController()