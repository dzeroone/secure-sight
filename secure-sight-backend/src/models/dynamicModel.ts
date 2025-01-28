import mongoose, { Connection } from "mongoose";
const Schema = mongoose.Schema;
const dynamicSchema = new Schema({}, { versionKey: false, strict: false, minimize: false })

let dynamicModels: any = {}
let dbConnectionPool: Map<string, Connection> = new Map()

export const dynamicModelWithDBConnection = (dbName: string, collectionName: string) => {
    let cacheId = dbName + collectionName
    // const url = `${process.env.mongo_base_url}/${dbName}?authSource=admin&authMechanism=SCRAM-SHA-256`
    
    if (!(cacheId in dynamicModels)) {
        const url = `${process.env.mongo_base_url}/${dbName}`
        let connection = dbConnectionPool.get(dbName)
        if(!connection) {
            let conn = mongoose.createConnection(url, { maxPoolSize: 10 })
            conn.once('open', () => {
                console.log(`Mongodb (${dbName}) called the (${collectionName}) collection!`)
            })
            connection = conn
            dbConnectionPool.set(dbName, conn)
        }
        
        dynamicModels[cacheId] = connection!.model(collectionName, dynamicSchema, collectionName)
    }
    return dynamicModels[cacheId]
}

// let dynamicModels: any = {};
// export const dynamicModel = (collectionName: string) => {
//     if (!(collectionName in dynamicModels)) {
//         dynamicModels[collectionName] = mongoose.model(collectionName, dynamicSchema, collectionName);
//     }
//     return dynamicModels[collectionName];
// }