import { Document } from "mongoose";
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant";
import { dynamicModelWithDBConnection } from "../models/dynamicModel";
import { CustomerCreateValidationValues } from "../validators/customer-create.validator";
import customerDLChangeModel, { CustomerDLChangeDocumentType } from "../models/customerDLChangeModel";
import { DLChangeValidationValues } from "../validators/dl-change-proposal.validator";
import userController from "./user.controller";

class CustomerController {
  async addCustomer(data: CustomerCreateValidationValues) {
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
    return CustomerModel.find({}, { tCode: 1, name: 1 }).lean()
  }

  async getCodesByIds(cIds: string[]) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find({
      _id: { $in: cIds }
    }, { tCode: 1, name: 1 }).lean()
  }

  async getCustomerById(id: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.findById(id)
  }

  async getCustomerByTenantCode(tCode: string) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.findOne({
      tCode: {
        $regex: tCode, $options: 'i'
      }
    })
  }

  async getDLChangeProposalById(id: string) {
    return customerDLChangeModel.findById(id)
  }

  async getDLChangeProposalByUser(customerId: string, userId: string) {
    return customerDLChangeModel.findOne({
      cId: customerId,
      uId: userId
    })
  }

  async getDLChangeProposalsForCustomerId(customerId: string) {
    const proposals = await customerDLChangeModel.find({
      cId: customerId
    }).lean()

    const data = []
    for (let proposal of proposals) {
      const user = await userController.getUserById(proposal.uId!)
      data.push({
        ...proposal,
        user: {
          _id: user?._id,
          fullname: user?.fullname
        }
      })
    }
    return data
  }

  async getDLChangeProposals() {
    const proposals = await customerDLChangeModel.find({}).lean()
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)

    const data = []
    for (let proposal of proposals) {
      const customer = await CustomerModel.findById(proposal.cId, { name: 1 }).lean()
      const user = await userController.getUserById(proposal.uId!)
      data.push({
        ...proposal,
        customer,
        user: {
          _id: user?._id,
          fullname: user?.fullname
        }
      })
    }
    return data
  }

  async updateCustomer(user: Document, data: any) {
    return user.updateOne({
      $set: data
    })
  }

  async addDLProposal(customerId: string, userId: string, data: DLChangeValidationValues) {
    const doc = new customerDLChangeModel({
      ...data,
      cId: customerId,
      uId: userId,
      cAt: new Date(),
      uAt: new Date()
    })
    return doc.save()
  }

  async updateDLProposal(proposalId: string, data: DLChangeValidationValues) {
    return customerDLChangeModel.updateOne({
      _id: proposalId
    }, {
      $set: {
        ...data,
        uAt: new Date()
      }
    })
  }

  async accepDLChangeProposal(proposal: CustomerDLChangeDocumentType) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    await CustomerModel.updateOne({
      _id: proposal.cId
    }, {
      $set: {
        emails: proposal.emails
      }
    })
    return proposal.delete()
  }

  async removeAll() {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    await CustomerModel.deleteMany({})
  }
}

export default new CustomerController()