import { genSalt, hash } from "bcryptjs";
import { COLLECTIONS, MASTER_ADMIN_DB, ROLES } from "../constant"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { Document } from "mongoose";
import assignmentController from "./assignment.controller";
import assignmentReportController from "./assignment-report.controller";
import customerController from "./customer.controller";

class UserController {
  async addUser(data: any) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    data.email = data.email.trim().toLowerCase()
    const exisiting = await userModel.findOne({
      email: data.email
    });
    if (exisiting) throw new Error("Email already exists")
    const salt = await genSalt(10)
    const hashedPassword = await hash(data.password, salt)
    data.password = hashedPassword
    const user = new userModel(data)
    await user.save()
    return true
  }

  async search(query: string, user: Express.User) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const skippedRoles = [ROLES.ADMIN]
    if (user.role == ROLES.LEVEL3) {
      skippedRoles.push(ROLES.LEVEL3)
    } else if (user.role == ROLES.LEVEL2) {
      skippedRoles.push(ROLES.LEVEL3, ROLES.LEVEL2)
    }
    return UserModel.find({
      role: {
        $nin: skippedRoles
      },
      $or: [
        {
          email: new RegExp(query, "si")
        },
        {
          fullname: new RegExp(query, "si")
        }
      ]
    }, {
      fullname: 1,
      role: 1
    }).limit(20).sort({ fullname: 1 })
  }

  async listUsers() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.find()
  }

  async listUsersByRole(roles: string[]) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.find({
      role: {
        $in: roles
      }
    })
  }

  async getUserById(id: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.findById(id, { password: 0 })
  }

  async getUserByIdAndRole(id: string, roles: string[]) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.findOne({
      _id: id,
      role: {
        $in: roles
      }
    }, { password: 0 })
  }

  async updateUser(user: any, data: any) {
    if (data.password) {
      const salt = await genSalt(10)
      const hashedPassword = await hash(data.password, salt)
      data.password = hashedPassword
    } else {
      delete data.password
    }
    if (user.role == ROLES.ADMIN) {
      delete data.role
    }
    return user.updateOne({
      $set: data
    })
  }

  async deleteUser(user: any) {
    {
      const assignments = await assignmentController.getAssignmentsForAssigneeId(user._id)
      for (let assignment of assignments) {
        await assignmentController.delete(assignment)
      }
    }
    {
      const assignments = await assignmentController.getAssignmentsForReporterId(user._id)
      for (let assignment of assignments) {
        await assignmentController.delete(assignment)
      }
    }
    {
      const reports = await assignmentReportController.getAllByReporterId(user._id)
      for (let report of reports) {
        await assignmentReportController.deleteById(report._id.toString())
      }
    }
    return user.delete()
  }

  async getDashboardDataForUser(user: Express.User) {
    return {
      submissions: await assignmentController.getPendingReviewsForUser(user),
      dlChanges: user.role == ROLES.ADMIN ? await customerController.getDLChangeProposals() : []
    }
  }

  async removeAll() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    await userModel.deleteMany({})
  }
}

export default new UserController()