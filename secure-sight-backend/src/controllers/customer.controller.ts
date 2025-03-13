import { Document } from "mongoose";
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant";
import { dynamicModelWithDBConnection } from "../models/dynamicModel";

class CustomerController {
  async addCustomer(data: any) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customer = new CustomerModel(data)
    return customer.save()
  }

  async listCustomers() {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find().lean()
  }

  async getAllCodes() {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find({}, { tCode: 1 }).lean()
  }

  async getCodesByIds(cIds: string[]) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find({
      _id: { $in: cIds }
    }, { tCode: 1 }).lean()
  }

  async getCustomerById(id: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.findById(id)
  }

  async updateCustomer(user: Document, data: any) {
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