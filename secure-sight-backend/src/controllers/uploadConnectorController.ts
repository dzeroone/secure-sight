import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { dynamicModelWithDBConnection } from '../models/dynamicModel'
import { COLLECTIONS, MASTER_ADMIN_DB } from '../constant'
import logger from '../utils/logger'

class UploadConnectorController {

    async uploadConnector(req: any) {
        const { name, connectorId, currentChunkIndex, totalChunks, email, dbName, nameWithoutExtension, display_name, category } = req.query
        const localDirPath = path.resolve(process.env.PWD || '', `../secure-sight-scheduler/server`)
        // const localDirPath = path.resolve(process.env.PWD, `../orion-scheduler/server`)
        const firstChunk = parseInt(currentChunkIndex) === 0
        const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1
        const data = req.body.toString().split(',')[1] || 'dummy content'
        const buffer = Buffer.from(data, 'base64')

        // save file to the name of connector base path
        const connectorBasePath = connectorId
        const tmpFilename = connectorBasePath + path.extname(name)
        const filePath = `${localDirPath}/${tmpFilename}`

        if (!fs.existsSync(localDirPath)) {
            fs.mkdirSync(localDirPath, { recursive: true })
        }
        if (firstChunk && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        fs.appendFileSync(filePath, buffer)
        if (lastChunk) {
            if ((parseInt(totalChunks) - 1) === parseInt(currentChunkIndex)) {
                const connectorConfigModel = dynamicModelWithDBConnection(
                    MASTER_ADMIN_DB,
                    COLLECTIONS.CONNECTOR_CONFIG,
                )
                const connectorModel = dynamicModelWithDBConnection(
                    MASTER_ADMIN_DB,
                    COLLECTIONS.CONNECTOR,
                )

                const userModel = dynamicModelWithDBConnection(
                    MASTER_ADMIN_DB,
                    COLLECTIONS.USERS,
                )
                // const query = { email, name: nameWithoutExtension, display_name, category }
                const query = { name: nameWithoutExtension, display_name }
                const user = await userModel.findOne({
                    email: email.toLowerCase()
                })
                const obj = await connectorModel.findOne(query)
                if (obj) {
                    await connectorModel.findOneAndUpdate(query, { $set: { filePath, updated_at: new Date() } })

                    // update connector config data
                    const isConnectorConfigExist = await connectorConfigModel
                        .findOne({
                            connectorId: obj._id,
                        })
                        .lean()

                    const configData = {
                        connectorId: obj._id,
                        config: obj.config.properties,
                        connectorBasePath,
                        connectorFileNameWithExtension: 'inventry.py',
                        updatedAt: new Date()
                    }
                    if (isConnectorConfigExist) {
                        await connectorConfigModel.findOneAndUpdate(
                            {
                                connectorId: obj._id,
                            },
                            {
                                $set: configData,
                            },
                        )
                    } else {
                        const cConfig = new connectorConfigModel({
                            ...configData,
                            createdAt: new Date()
                        })
                        await cConfig.save()
                    }
                }
                logger.info({
                    msg: `${user?.fullname || email} has uploaded ${display_name.replaceAll(/_|-/g, ' ')} connector`
                })
            }
            
            return { msg: 'processing', tmpFilename }
        } else {
            return { msg: 'Connector upload failed' }
        }
    }
}

export default new UploadConnectorController()