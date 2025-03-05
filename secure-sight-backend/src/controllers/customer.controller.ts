import { genSalt, hash } from "bcryptjs";
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant"
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { Document } from "mongoose";

class CustomerController {
  async addCustomer(data: any) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customer = new CustomerModel(data)
    await customer.save()
    return true
  }

  async listCustomers() {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find()
  }

  async getCustomerById(id: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.findById(id)
  }

  async updateCustomer(user: Document, data: any) {
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
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    await CustomerModel.deleteMany({})
  }
}

export default new CustomerController()