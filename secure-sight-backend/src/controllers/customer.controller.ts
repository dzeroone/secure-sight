import { Document } from "mongoose";
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant";
import { dynamicModelWithDBConnection } from "../models/dynamicModel";
import { CustomerCreateValidationValues } from "../validators/customer-create.validator";
import customerDLChangeModel, { CustomerDLChangeDocumentType } from "../models/customerDLChangeModel";
import { DLChangeValidationValues } from "../validators/dl-change-proposal.validator";
import userController from "./user.controller";
import customerConnectorConfigController from "./customer-connector-config.controller";

class CustomerController {
  async addCustomer(data: CustomerCreateValidationValues) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    const customer = new CustomerModel({
      ...data,
      status: 1
    })
    const cData = await customer.save()
    await customerConnectorConfigController.updateConnectorConfig({
      previousConnectors: [],
      tCode: data.tCode,
      connectorIds: data.connectors,
      configData: data.apiConfig
    })

    return cData
  }

  async updateCustomer(user: Document, data: any) {
    delete data.status
    const cData = await user.updateOne({
      $set: data
    })
    // @ts-ignore
    const previousConnectors = user.connectors;

    await customerConnectorConfigController.updateConnectorConfig({
      previousConnectors,
      // @ts-ignore
      tCode: data.tCode || user.tCode,
      // @ts-ignore
      connectorIds: data.connectors || user.connectors,
      // @ts-ignore
      configData: data.apiConfig || user.apiConfig
    })
  }

  async deleteCustomer(customer: any) {
    const cData = await customer.update({
      $set: {
        status: -1
      }
    })
    await customerConnectorConfigController.updateConnectorConfig({
      previousConnectors: customer.connectors,
      tCode: customer.tCode,
      connectorIds: [],
      configData: customer.apiConfig
    })
    return cData
  }

  async deleteCustomerPermanently(customer: Document) {
    return customer.delete()
  }

  async restore(customer: any) {
    const cData = await customer.update({
      $set: {
        status: 1
      }
    })
    await customerConnectorConfigController.updateConnectorConfig({
      previousConnectors: [],
      tCode: customer.tCode,
      connectorIds: customer.connectors,
      configData: customer.apiConfig
    })

    return cData
  }

  async listCustomers(status: string | null = null) {
    const query = typeof status == 'string' ? {
      status: parseInt(status)
    } : {
      $or: [{
        status: 1,
      }, { status: null }]
    }
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find(query).lean()
  }

  async getAllCodes() {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find({
      $or: [{
        status: 1,
      }, {
        status: null
      }]
    }, { tCode: 1, name: 1 }).sort({
      name: 1
    }).lean()
  }

  async getCodesByIds(cIds: string[]) {
    const CustomerModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.CUSTOMERS)
    return CustomerModel.find({
      _id: { $in: cIds }
    }, { tCode: 1, name: 1 }).sort({
      name: 1
    }).lean()
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