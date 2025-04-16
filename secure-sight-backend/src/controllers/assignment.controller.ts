import { COLLECTIONS, MASTER_ADMIN_DB, REPORT_AUDIT_STATUS } from "../constant"
import { formatReportSession, getMontlyReportIndex, getWeeklyReportIndex } from "../helper/reports.helper"
import assignmentMessageModel from "../models/assignmentMessageModel"
import assignmentModel, { AssignmentDocumentType } from "../models/assignmentModel"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { ReportAssignmentValidationValues } from "../validators/report-assignment.validator"
import assignmentReportController from "./assignment-report.controller"
import notificationController from "./notification.controller"

export type ReportType = 'monthly' | 'weekly'

class AssignmentController {
  async getById(id: string) {
    return assignmentModel.findById(id)
  }

  async delete(assignment: AssignmentDocumentType) {
    let lAssignment = await this.getAssignmentByIndexForAssignee(assignment.index!, assignment.reporterId!)
    while (lAssignment) {
      await this.deleteById(lAssignment._id.toString())
      if (lAssignment.reportId) {
        await assignmentReportController.deleteById(lAssignment.reportId)
      }
      await assignmentMessageModel.deleteMany({
        aId: lAssignment._id
      })
      lAssignment = await this.getAssignmentByIndexForAssignee(assignment.index!, lAssignment.reporterId!)
    }

    if (assignment.reportId) {
      await assignmentReportController.deleteById(assignment.reportId)
    }
    await assignmentMessageModel.deleteMany({
      aId: assignment._id
    })
    return this.deleteById(assignment._id.toString())
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
      $set: {
        ...data,
        uAt: new Date()
      }
    })
  }

  async getCustomerInfo(customerId: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.findOne({ _id: customerId }, { name: 1, tCode: 1 }).lean()
  }

  async getUserInfo(userId: string) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return UserModel.findOne({
      _id: userId
    }, { fullname: 1, role: 1 }).lean()
  }

  async getMessages(assingmentId: string) {
    return assignmentMessageModel.find({ aId: assingmentId }).sort({ cAt: 1 })
  }

  async saveMessage(assingmentId: string, senderId: string, message: string) {
    const data = new assignmentMessageModel({
      aId: assingmentId,
      sId: senderId,
      msg: message,
      cAt: new Date()
    })
    return data.save()
  }

  async getCustomerWithAssignmentsForDate(date: string, assignedBy: string, reportType: ReportType) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customers = await CustomerModel.find({}, { name: 1, tCode: 1 }).lean()
    for (let customer of customers) {
      await this._populateAssignmentsForCustomerForDate(customer, date, assignedBy, reportType)
    }
    return customers
  }

  async getAssignmentsForDateForReporter(date: string, reporterId: string, reportType: ReportType) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const assignments: any[] = await assignmentModel.find({
      rType: reportType,
      date,
      reporterId: reporterId
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
      await this._populateAssignmentsForCustomerForDate(customer, date, reporterId)
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

    const savedReports = await assignmentReportController.getLatest({
      indices: assignments.map(a => a.index),
      reporterId: user._id
    })

    return assignments.map(assignment => {
      assignment.customer = customers.find(c => c._id.toString() == assignment.cId)
      assignment.savedReport = savedReports.find(sr => sr.index == assignment.index)
      return assignment
    })
  }

  async assignReport(data: ReportAssignmentValidationValues, assignedBy: string, reportType: ReportType) {
    const exists = await this.isReporterAssignedForIndex(data.reporterId, data.index)

    if (exists) throw new Error("Assignment already exists")

    const assignment = new assignmentModel({
      rType: reportType,
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

  async getCustomerIdsForUser(date: string, type: string, userId: string) {
    return assignmentModel.find({
      rType: type,
      date,
      reporterId: userId
    }, {
      cId: 1
    }).lean()
  }

  async getAssignmentsForReporterId(reporterId: string) {
    return assignmentModel.find({
      reporterId,
    })
  }

  async getAssignmentsForAssigneeId(assigneeId: string) {
    return assignmentModel.find({
      aBy: assigneeId,
    })
  }

  async getAssignmentByIndex(index: string) {
    return assignmentModel.findOne({
      index,
    })
  }

  async getAssignmentByIndexForReporter(index: string, reporterId: string) {
    const assignment = await assignmentModel.findOne({
      index,
      reporterId
    })
    return assignment
  }

  async getAssignmentByIndexForAuditer(index: string, reporterId: string) {
    const assignment = await assignmentModel.findOne({
      index,
      sTo: reporterId
    })
    return assignment
  }

  async getAssigneesByIndex(index: string, reportType: ReportType) {
    const assignments = await assignmentModel.find({
      rType: reportType,
      index,
    }, {
      aBy: 1
    })
    return assignments.map(a => a.aBy)
  }

  async getPermittedViewersByIndex(index: string, reportType: ReportType) {
    const assignments = await assignmentModel.find({
      rType: reportType,
      index,
    }, {
      aBy: 1
    })
    const viewers: string[] = []
    assignments.forEach(a => {
      viewers.push(a.aBy!, a.sBy!, a.sTo!)
    })

    return viewers
  }

  async reportSubmitted(assignment: AssignmentDocumentType, reportId: string, submitterId: string, submittedTo: string) {
    const res = await assignment.updateOne({
      $set: {
        reportId,
        status: REPORT_AUDIT_STATUS.SUBMITTED,
        sTo: submittedTo,
        sBy: submitterId,
        sCBy: submitterId,
        uAt: new Date()
      },
      $unset: {
        auditStatus: ""
      }
    })

    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const submitter = await UserModel.findById(submitterId, { fullname: 1 }).lean()

    const message = `A ${assignment.rType} report has been submitted by ${submitter?.fullname} for session (${formatReportSession(assignment.rType as ReportType, assignment.date!)})`
    await notificationController.notifyUser(assignment.aBy!, {
      title: "Report submission",
      message
    })
    return res
  }

  async reportApproved(assignment: AssignmentDocumentType, reportId: string, submitter: Express.User) {
    await this.updateById(assignment._id.toString(), {
      status: REPORT_AUDIT_STATUS.APPROVED,
      sCBy: submitter._id
    })

    let lAssignment = await this.getAssignmentByReportIdForAssignee(reportId, assignment.reporterId!)
    while (lAssignment) {
      await this.updateById(lAssignment._id.toString(), {
        status: REPORT_AUDIT_STATUS.APPROVED,
        sCBy: submitter._id
      })
      lAssignment = await this.getAssignmentByReportIdForAssignee(reportId, lAssignment.reporterId!)
    }

    await assignmentReportController.reportApproved(reportId, assignment.rType as ReportType, submitter)
  }

  async getSubmissions(user: Express.User, reportType: ReportType) {
    const assignments = await assignmentModel.find({
      rType: reportType,
      sTo: user._id,
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
      assignment.reporter = reporter

      const uAssignment = await this.getAssignmentByIndexForReporter(assignment.index!, assignment.aBy)
      assignment.isRoot = !uAssignment

      if (uAssignment) {
        const assignee = await UserModel.findOne({
          _id: uAssignment.aBy
        }, {
          fullname: 1,
          role: 1
        })
        assignment.upperAssignment = {
          _id: uAssignment._id,
          assignedBy: assignee
        }
      }
    }
    return assignments
  }

  async getPendingReviewsForUser(assignee: Express.User) {
    const assignments = await assignmentModel.find({
      aBy: assignee._id,
      status: REPORT_AUDIT_STATUS.SUBMITTED
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

      const uAssignment = await this.getAssignmentByIndexForReporter(assignment.index!, assignee._id)
      assignment.isRoot = !uAssignment

      if (uAssignment) {
        const assignee = await UserModel.findOne({
          _id: uAssignment.aBy
        }, {
          fullname: 1,
          role: 1
        })
        assignment.upperAssignment = {
          _id: uAssignment._id,
          assignedBy: assignee
        }
      }

      assignment.reporter = reporter
    }
    return assignments
  }

  async getAssignmentByReportIdForAssignee(reportId: string, assignedBy: string) {
    return assignmentModel.findOne({
      reportId,
      aBy: assignedBy
    })
  }

  async getAssignmentByReportIdForAuditer(reportId: string, auditerId: string) {
    return assignmentModel.findOne({
      reportId,
      sTo: auditerId
    })
  }

  async getAssignmentByIndexForAssignee(index: string, assignedBy: string) {
    return assignmentModel.findOne({
      index,
      aBy: assignedBy
    })
  }

  async getReporterIdsForIndex(index: string) {
    const docs = await assignmentModel.find({
      index
    }, { reporterId: 1 })
    return docs.map(d => d.reporterId)
  }

  async isReporterAssignedForIndex(reporterId: string, index: string) {
    const doc = await assignmentModel.findOne({
      index,
      reporterId
    }, { reporterId: 1 })
    return !!doc
  }

  async isLastReporter(index: string, reporterId: string) {
    const assignment = await this.getAssignmentByIndexForAssignee(index, reporterId)
    if (assignment) {
      // user have assigned report to another user
      return false
    }
    return true
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