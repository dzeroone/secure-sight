import path from "path";
import { CustomerCreateValidationValues } from "../validators/customer-create.validator";
import { COLLECTIONS, DIRS, MASTER_ADMIN_DB } from "../constant";
import { dynamicModelWithDBConnection } from "../models/dynamicModel";
import mongoose from "mongoose";
import ini, { stringify } from 'ini';
import { access, constants, readFile, writeFile } from "fs/promises";
import decompress from "decompress";

type ConfigDataType = CustomerCreateValidationValues['apiConfig']

class CustomerConnectorConfigController {
  async updateConnectorConfig(
    tenantConfig: {
      previousConnectors: string[]
      tCode: string,
      connectorIds: string[],
      configData: ConfigDataType
    }
  ) {
    for (let connectorId of tenantConfig.connectorIds) {
      await this._updateIniConfig(
        connectorId,
        tenantConfig.tCode,
        tenantConfig.configData
      )
    }

    const deleteConnectors = tenantConfig.previousConnectors.filter(pc => !tenantConfig.connectorIds.includes(pc))
    for (let connectorId of deleteConnectors) {
      try {
        await this._updateIniConfig(
          connectorId,
          tenantConfig.tCode,
          tenantConfig.configData,
          false
        )
      } catch (e) { }
    }
  }

  private async _updateIniConfig(
    connectorId: string,
    tenantCode: string,
    configData: ConfigDataType,
    isInsert = true
  ) {
    const ConnectorConfigModel = dynamicModelWithDBConnection(
      MASTER_ADMIN_DB,
      COLLECTIONS.CONNECTOR_CONFIG,
    )

    const config_data = await ConnectorConfigModel
      .findOne({ connectorId: new mongoose.Types.ObjectId(connectorId) })
      .lean()

    let { connectorBasePath }: any = config_data

    const configFilePath = path.resolve(DIRS.CONNECTOR_UPLOAD_DIR, connectorBasePath, 'config.ini')
    const zipFilePath = path.join(DIRS.CONNECTOR_UPLOAD_DIR, connectorBasePath + `.zip`)

    try {
      await access(configFilePath, constants.F_OK)
    } catch (e) {
      try {
        await decompress(zipFilePath, path.join(DIRS.CONNECTOR_UPLOAD_DIR, connectorBasePath))
      } catch (e) {
        throw e
      }
    }

    const iniText = await readFile(configFilePath, { encoding: 'utf-8' })
    const iniConfig = ini.parse(iniText)

    const upperCasedTenantCode = tenantCode.toUpperCase()
    if (!iniConfig[upperCasedTenantCode]) {
      if (!isInsert) return
      iniConfig[upperCasedTenantCode] = {}
    }
    if (!isInsert) {
      delete iniConfig[upperCasedTenantCode]
    } else {
      const updated = iniConfig[upperCasedTenantCode]
      updated.a1_base_url = configData.apex.baseUrl
      updated.a1_application_id = configData.apex.appId
      updated.a1_api_key = configData.apex.apiKey

      updated.v1_base_url = configData.tmv.baseUrl
      updated.v1_api_key = configData.tmv.apiKey

      updated.soar_base_url = configData.soar.baseUrl
      updated.soar_api_key = configData.soar.apiKey

      updated.cloud_app_sec_base_url = configData.cas.baseUrl
      updated.cloud_app_sec_api_key = configData.cas.apiKey

      updated.c1_base_url = configData.caw.baseUrl
      updated.c1_api_key = configData.caw.apiKey
    }

    /**
     * @TODO
     * Deep security config parameters are missing
     */
    const updatedIni = stringify(iniConfig)
    await writeFile(configFilePath, updatedIni)
  }
}

export default new CustomerConnectorConfigController()