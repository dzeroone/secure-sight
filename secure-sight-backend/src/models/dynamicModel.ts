import mongoose, { Connection, Model } from "mongoose";
const Schema = mongoose.Schema;

const dynamicSchema = new Schema<{ [key: string]: any }>({}, { versionKey: false, strict: false, minimize: false })

let dynamicModels: Map<string, Model<{ [key: string]: any }, {}, {}, {}, typeof dynamicSchema>> = new Map()
let dbConnectionPool: Map<string, Connection> = new Map()

export const dynamicModelWithDBConnection = (dbName: string, collectionName: string) => {
    const cacheId = dbName + collectionName
    // const url = `${process.env.mongo_base_url}/${dbName}?authSource=admin&authMechanism=SCRAM-SHA-256`
    const model = dynamicModels.get(cacheId)

    if (!model) {
        const url = `${process.env.mongo_base_url}/${dbName}`
        let connection = dbConnectionPool.get(dbName)
        if (!connection) {
            let conn = mongoose.createConnection(url, { maxPoolSize: 10 })
            conn.once('open', () => {
                console.log(`Mongodb (${dbName}) called the (${collectionName}) collection!`)
            })
            connection = conn
            dbConnectionPool.set(dbName, conn)
        }

        const newModel = connection.model(collectionName, dynamicSchema, collectionName)
        dynamicModels.set(cacheId, newModel)
        return newModel
    }
    return model
}

// let dynamicModels: any = {};
// export const dynamicModel = (collectionName: string) => {
//     if (!(collectionName in dynamicModels)) {
//         dynamicModels[collectionName] = mongoose.model(collectionName, dynamicSchema, collectionName);
//     }
//     return dynamicModels[collectionName];
// }