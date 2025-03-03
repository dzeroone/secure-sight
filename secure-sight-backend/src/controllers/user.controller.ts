import { genSalt, hash } from "bcryptjs";
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { Document } from "mongoose";

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

  async listUsers() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.find()
  }

  async getUserById(id: string) {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    return userModel.findById(id, { password: 0 })
  }

  async updateUser(user: Document, data: any) {
    if (data.password) {
      const salt = await genSalt(10)
      const hashedPassword = await hash(data.password, salt)
      data.password = hashedPassword
    }
    return user.updateOne({
      $set: data
    })
  }

  async removeAll() {
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    await userModel.deleteMany({})
  }
}

export default new UserController()