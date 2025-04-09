import { writeFile } from "fs/promises"
import { REPORT_AUDIT_STATUS, REPORT_DIR } from "../constant"
import assignmentReportModel, { AssignmentReportDocumentType } from "../models/assignmentReportModel"
import { MonthlyReportEditValidationValues, MonthlyReportValidationValues } from "../validators/monthly-report.validator"
import { WeeklyReportEditValidationValues, WeeklyReportValidationValues } from "../validators/weekly-report.validator"
import { ReportType } from "./assignment.controller"
import pdfController from "./pdf.controller"
import path from "path"

class AssignmentReportController {
  async getPaginated(query: any, user: Express.User, reportType: ReportType) {
    const pageNumber = Number(query.page) || 1
    let filterQuery: any = {
      reporterId: user._id,
    }
    if (query.index) {
      filterQuery.index = query.index
    }

    const search = query.search || ''

    switch (reportType) {
      case 'monthly':
        filterQuery['$or'] = [
          {
            'data.monthly_report.doc_title': new RegExp(`^${search}`, "si")
          },
          {
            'data.monthly_report.client_name': new RegExp(`${search}`, "si")
          },
          {
            'data.monthly_report.customer_name': new RegExp(`${search}`, "si")
          },
          {
            'data.monthly_report.date': new RegExp(`${search}`, "si")
          }
        ]
        break;
      case 'weekly':
        filterQuery['$or'] = [
          {
            'data.formData.client.clientName': new RegExp(`^${search}`, "si")
          },
          {
            'data.reportData.WEEKLY_REPORT.start_date': new RegExp(`${search}`, "si")
          },
          {
            'data.reportData.WEEKLY_REPORT.end_date': new RegExp(`${search}`, "si")
          }
        ]
        break;
    }
    const count = await assignmentReportModel.countDocuments(filterQuery)
    const data = await assignmentReportModel.find(filterQuery).sort({ uAt: -1, cAt: -1 }).limit(20).skip((pageNumber - 1) * 20).lean()
    return { count, data }
  }

  async getAllByReporterId(reporterId: string) {
    return assignmentReportModel.find({
      reporterId
    })
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
      return doc.updateOne({
        $set: {
          data: { formData: data.formData, reportData: data.reportData },
          status: data.status,
          uAt: new Date()
        }
      })
    }
  }

  async reportApproved(id: string, reportType: ReportType, user: Express.User) {
    const reportData = await this.getById(id)
    if (!reportData) throw new Error("Report not found!")

    // generate pdf
    let fileName = ''
    if (reportType == 'monthly') {
      // save monthly pdf
      const pdfData = await pdfController.generateMonthlyPdf(reportData?.data)
      fileName = `mr-${reportData.index}.pdf`
      await writeFile(path.resolve(REPORT_DIR, fileName), pdfData)
    } else {
      // save weekly pdf
      const pdfData = await pdfController.generateWeeklyPdf({
        id
      }, user)
      fileName = `wr-${reportData.index}.pdf`
      await writeFile(path.resolve(REPORT_DIR, fileName), pdfData)

    }
    return this.updateById(id, {
      auditStatus: REPORT_AUDIT_STATUS.APPROVED,
      fileName
    })
  }

  async updateById(id: string, data: any) {
    return assignmentReportModel.updateOne({
      _id: id
    }, {
      $set: {
        ...data,
        uAt: new Date()
      }
    })
  }

  async getLatest({
    indices,
    reporterId
  }: { indices: string[], reporterId: string }) {
    return assignmentReportModel.aggregate([
      {
        $match: { index: { $in: indices }, reporterId }
      },
      {
        $group: {
          _id: "$index",
          mUAt: {
            $max: '$uAt'
          },
          reportId: { $first: "$_id" }
        }
      },
      {
        $project: {
          _id: "$reportId",
          index: "$_id"
        }
      }
    ])
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