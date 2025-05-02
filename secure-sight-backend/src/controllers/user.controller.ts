import { genSalt, hash } from "bcryptjs";
import { COLLECTIONS, MASTER_ADMIN_DB, ROLES } from "../constant"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { Document } from "mongoose";
import assignmentController from "./assignment.controller";
import assignmentReportController from "./assignment-report.controller";
import customerController from "./customer.controller";
import teamController from "./team.controller";

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

  async search(search: string, index: string, user: Express.User) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const skipedUserIds = await assignmentController.getReporterIdsForIndex(index)
    const skippedRoles = [ROLES.ADMIN]
    if (user.role == ROLES.LEVEL3) {
      skippedRoles.push(ROLES.LEVEL3)
    } else if (user.role == ROLES.LEVEL2) {
      skippedRoles.push(ROLES.LEVEL3, ROLES.LEVEL2)
    }
    return UserModel.find({
      _id: {
        $nin: skipedUserIds
      },
      role: {
        $nin: skippedRoles
      },
      status: { $ne: -1 },
      $or: [
        {
          email: new RegExp(search, "si")
        },
        {
          fullname: new RegExp(search, "si")
        }
      ]
    }, {
      fullname: 1,
      role: 1
    }).limit(20).sort({ fullname: 1 })
  }

  async listUsers() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const users = await userModel.find({
      status: { $ne: -1 }
    }).lean()
    for (let user of users) {
      if (user.team) {
        const team = await teamController.getById(user.team)
        user.team = team
      }
    }
    return users
  }

  async listDeletedUsers() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const users = await userModel.find({
      status: -1
    }).lean()
    for (let user of users) {
      if (user.team) {
        const team = await teamController.getById(user.team)
        user.team = team
      }
    }
    return users
  }

  async listUsersByRole(roles: string[]) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const users = await userModel.find({
      role: {
        $in: roles
      }
    }).lean()
    for (let user of users) {
      user.team = await teamController.getById(user.team)
    }
    return users
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
    data.email = data.email.toLowerCase().trim()

    if (user.email != data.email) {
      const exists = await this.findOneByEmail(data.email)
      if (exists) {
        throw new Error("User with email already exists!")
      }
    }

    if (data.role && user.role !== data.role) {
      const pending = await assignmentController.getPendingAssignmentsForUser(user._id)
      if (pending.length) {
        throw new Error(`You can't change the role. This user has pending task to complete.`)
      }
    }
    return user.updateOne({
      $set: data
    })
  }

  async deleteUser(user: any) {
    // {
    //   const assignments = await assignmentController.getAssignmentsForAssigneeId(user._id)
    //   for (let assignment of assignments) {
    //     await assignmentController.delete(assignment)
    //   }
    // }
    // {
    //   const assignments = await assignmentController.getAssignmentsForReporterId(user._id)
    //   for (let assignment of assignments) {
    //     await assignmentController.delete(assignment)
    //   }
    // }
    // {
    //   const reports = await assignmentReportController.getAllByReporterId(user._id)
    //   for (let report of reports) {
    //     await assignmentReportController.deleteById(report._id.toString())
    //   }
    // }
    const pending = await assignmentController.getPendingAssignmentsForUser(user._id)
    if (pending.length) {
      throw new Error(`You can't delete the user. This user has pending task to complete.`)
    }
    return user.update({
      $set: {
        status: -1
      }
    })
  }

  async restoreUser(user: any) {
    return user.update({
      $set: {
        status: 1
      }
    })
  }

  async findOneByEmail(email: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.findOne({ email })
  }

  async getDashboardDataForUser(user: Express.User) {
    return {
      submissions: await assignmentController.getPendingReviewsForUser(user),
      dlChanges: user.role == ROLES.ADMIN ? await customerController.getDLChangeProposals() : []
    }
  }

  async assignTeam(data: any) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.updateMany({
      _id: {
        $in: data.users
      }
    }, {
      $set: {
        team: data.team
      }
    })
  }

  async unassignTeam(teamId: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.updateMany({
      team: teamId
    }, {
      $set: {
        team: ''
      }
    })
  }

  async getSameLevelUsers(userId: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const user = await userModel.findById(userId)
    if (!user) throw new Error("User not found!")

    return userModel.find({
      role: user.role
    }, {
      fullname: 1
    }).lean()
  }

  async transferAdmin(fromUser: string, toUser: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)

    // check if toUser has any kind of pending task
    const pending = await assignmentController.getPendingAssignmentsForUser(toUser)
    if (pending.length > 0) {
      throw new Error("User have pending tasks, can't change role. Please contact administrator for details.")
    }

    await userModel.updateOne({
      _id: fromUser
    }, {
      $set: {
        role: ''
      }
    })
    await userModel.updateOne({
      _id: toUser
    }, {
      $set: {
        role: ROLES.ADMIN
      }
    })
  }

  async getTransferSuggestions(userId: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    const user = await userModel.findById(userId)
    if(!user) throw new Error("user not found")
    return userModel.find({
      _id: {$ne: userId},
      role: user.role
    }, {
      fullname: 1
    })
  }

  async removeAll() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    await userModel.deleteMany({})
  }
}

export default new UserController()