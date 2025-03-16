import { COLLECTIONS, MASTER_ADMIN_DB, REPORT_AUDIT_STATUS } from "../constant"
import { getMontlyReportIndex, getWeeklyReportIndex } from "../helper/reports.helper"
import assignmentModel, { AssignmentDocumentType } from "../models/assignmentModel"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { ReportAssignmentValidationValues } from "../validators/report-assignment.validator"
import monthlyReportController from "./assignment-report.controller"

export type ReportType = 'monthly' | 'weekly'

class AssignmentController {
  async getById(id: string) {
    return assignmentModel.findById(id)
  }

  async deleteById(id: string) {
    return assignmentModel.deleteOne({
      _id: id
    })
  }

  async updateById(id: string, data: any) {
    return assignmentModel.updateOne({
      _id: id
    }, {
      $set: data
    })
  }

  async getMonthlyAssignmentsForDate(date: string, assignedBy: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customers = await CustomerModel.find({}, { name: 1, tCode: 1 }).lean()
    for (let customer of customers) {
      await this._populateAssignmentsForCustomerForDate(customer, date, assignedBy)
    }
    return customers
  }

  async getMonthlyAssignmentsForDateForUser(date: string, userId: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const assignments: any[] = await assignmentModel.find({
      rType: 'monthly',
      date,
      reporterId: userId
    }).lean()
    const customerIds = assignments.map(a => a.cId)
    const customers = await CustomerModel.find({
      _id: {
        $in: customerIds
      }
    }, {
      name: 1,
      tCode: 1
    }).lean()

    for (let customer of customers) {
      await this._populateAssignmentsForCustomerForDate(customer, date, userId)
    }
    return customers
  }

  async getMonthlyAssignmentsForUser(user: Express.User) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const assignments: any[] = await assignmentModel.find({
      rType: 'monthly',
      reporterId: user._id
    }).sort({ cAt: -1 }).lean()
    const customerIds = assignments.map(a => a.cId)
    const customers = await CustomerModel.find({
      _id: {
        $in: customerIds
      }
    }, {
      name: 1,
      tCode: 1
    }).lean()

    return assignments.map(assignment => {
      assignment.customer = customers.find(c => c._id.toString() == assignment.cId)
      return assignment
    })
  }

  async assignMonthlyReport(data: ReportAssignmentValidationValues, assignedBy: string) {
    const exists = await assignmentModel.findOne({
      rType: 'monthly',
      date: data.date,
      index: data.index,
      aBy: assignedBy,
      reporterId: data.reporterId,
    })

    if (exists) throw new Error("Assignment already exists")

    const assignment = new assignmentModel({
      rType: 'monthly',
      date: data.date,
      index: data.index,
      cId: data.customerId,
      aBy: assignedBy,
      reporterId: data.reporterId,
      cAt: new Date(),
      uAt: new Date()
    })

    return assignment.save()
  }

  async getWeeklyAssignmentsForDate(date: string, assignedBy: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customers = await CustomerModel.find({}, { name: 1, tCode: 1 }).lean()
    for (let customer of customers) {
      await this._populateAssignmentsForCustomerForDate(customer, date, assignedBy, 'weekly')
    }
    return customers
  }

  async getWeeklyAssignmentsForDateForUser(date: string, userId: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const assignments: any[] = await assignmentModel.find({
      rType: 'weekly',
      date,
      reporterId: userId
    }).lean()
    const customerIds = assignments.map(a => a.cId)
    const customers = await CustomerModel.find({
      _id: {
        $in: customerIds
      }
    }, {
      name: 1,
      tCode: 1
    }).lean()

    for (let customer of customers) {
      await this._populateAssignmentsForCustomerForDate(customer, date, userId, 'weekly')
    }
    return customers
  }

  async getWeeklyAssignmentsForUser(user: Express.User) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const assignments: any[] = await assignmentModel.find({
      rType: 'weekly',
      reporterId: user._id
    }).sort({ cAt: -1 }).lean()
    const customerIds = assignments.map(a => a.cId)
    const customers = await CustomerModel.find({
      _id: {
        $in: customerIds
      }
    }, {
      name: 1,
      tCode: 1
    }).lean()

    return assignments.map(assignment => {
      assignment.customer = customers.find(c => c._id.toString() == assignment.cId)
      return assignment
    })
  }

  async assignWeeklyReport(data: ReportAssignmentValidationValues, assignedBy: string) {
    const exists = await assignmentModel.findOne({
      rType: 'weekly',
      date: data.date,
      index: data.index,
      aBy: assignedBy,
      reporterId: data.reporterId,
    })

    if (exists) throw new Error("Assignment already exists")

    const assignment = new assignmentModel({
      rType: 'weekly',
      date: data.date,
      index: data.index,
      cId: data.customerId,
      aBy: assignedBy,
      reporterId: data.reporterId,
      cAt: new Date(),
      uAt: new Date()
    })

    return assignment.save()
  }

  async getCustomerIdsForUser(date: string, type: string, userId: string) {
    return assignmentModel.find({
      rType: type,
      date,
      reporterId: userId
    }, {
      cId: 1
    }).lean()
  }

  async getAssignmentByIndex(index: string) {
    return assignmentModel.findOne({
      index,
    }).lean()
  }

  async getAssignmentByIndexForUser(index: string, userId: string) {
    return assignmentModel.findOne({
      index,
      reporterId: userId
    }).lean()
  }

  async getAssignmentForReporter(index: string, reporterId: string, reportType: ReportType) {
    const assignment = await assignmentModel.findOne({
      rType: reportType,
      index,
      reporterId
    })
    return assignment
  }

  async getAssigneesForReport(index: string, reportType: ReportType) {
    const assignments = await assignmentModel.find({
      rType: reportType,
      index,
    }, {
      aBy: 1
    })
    return assignments.map(a => a.aBy)
  }

  async reportSubmitted(assignment: AssignmentDocumentType, reportId: string) {
    return await assignment.updateOne({
      $set: {
        reportId,
        status: REPORT_AUDIT_STATUS.SUBMITTED,
        uAt: new Date()
      },
      $unset: {
        auditStatus: ""
      }
    })
  }

  async getSubmissions(assignee: Express.User, reportType: ReportType) {
    const assignments = await assignmentModel.find({
      rType: reportType,
      aBy: assignee._id,
      status: {
        $exists: true
      }
    }).sort({
      uAt: -1
    }).lean() as any[]

    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)

    for (let assignment of assignments) {
      const customer = await CustomerModel.findOne({
        _id: assignment.cId
      }, {
        name: 1
      })
      assignment.customer = customer

      const reporter = await UserModel.findOne({
        _id: assignment.reporterId
      }, {
        fullname: 1,
        role: 1
      })

      const uAssignment = await this.getAssignmentForReporter(assignment.index!, assignee._id, reportType)
      assignment.isRoot = !uAssignment

      assignment.reporter = reporter
    }
    return assignments
  }

  async getAssignmentByReportIdForAssignee(reportId: string, assignedBy: string, reportType: ReportType) {
    return assignmentModel.findOne({
      rType: reportType,
      reportId,
      aBy: assignedBy
    })
  }

  async getAssignmentByIndexForAssignee(index: string, assignedBy: string, reportType: ReportType) {
    return assignmentModel.findOne({
      rType: reportType,
      index,
      aBy: assignedBy
    })
  }

  private async _populateAssignmentsForCustomerForDate(customer: any, date: string, assignedBy: string, reportType: 'monthly' | 'weekly' = 'monthly') {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const assignments: any[] = await assignmentModel.find({
      rType: reportType,
      index: reportType == 'monthly' ? getMontlyReportIndex(date, customer.tCode) : getWeeklyReportIndex(date, customer.tCode),
      aBy: assignedBy,
      cId: customer._id,
    }).lean()
    for (let assignment of assignments) {
      assignment.reporter = await UserModel.findOne({
        _id: assignment.reporterId
      }, { fullname: 1, role: 1 })
    }
    customer.assignments = assignments
  }
}

export default new AssignmentController()