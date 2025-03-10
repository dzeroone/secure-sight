import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant"
import { getMontlyReportIndex } from "../helper/reports.helper"
import assignmentModel from "../models/assignmentModel"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { ReportAssignmentValidationValues } from "../validators/report-assignment.validator"

class AssignmentController {
  async getById(id: string) {
    return assignmentModel.findById(id)
  }
  async deleteById(id: string) {
    return assignmentModel.deleteOne({
      _id: id
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
      cAt: new Date()
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

  private async _populateAssignmentsForCustomerForDate(customer: any, date: string, assignedBy: string) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const assignments: any[] = await assignmentModel.find({
      rType: 'monthly',
      index: getMontlyReportIndex(date, customer.tCode),
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