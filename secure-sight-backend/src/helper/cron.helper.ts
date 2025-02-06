import fs from 'fs'
import { dynamicModelWithDBConnection } from '../models/dynamicModel'
import { COLLECTIONS } from '../constant'
import child_process from 'child_process'
import mongoose from 'mongoose'
const path = require('path')
import decompress from 'decompress'
import Pulse from '@pulsecron/pulse'

export enum SCHEDULE_JOB_NAME {
	RUN_PYTHON_COMMAND = 'run_python_command'
}

const scheduler = new Pulse({
	db: { address: `${process.env.mongo_base_url}/${process.env.mongo_db}` },
	defaultConcurrency: 4,
	maxConcurrency: 4,
	processEvery: '10 seconds',
	resumeOnRestart: true,
});

scheduler.define(SCHEDULE_JOB_NAME.RUN_PYTHON_COMMAND, async (job, done) => {
	const { command } = job.attrs.data
	child_process.exec(command, {}, (err, stdout, stderr) => {
		console.log(err, stdout, stderr)
		console.log('job running completed')
		done(err as any, stdout)
	})
})

let scheduledControllerDB: any = {}

const mainDb = process.env.mongo_db || ''

export interface SchedulingSchema {
	minutes?: number
	hours?: number
	days?: number
	months?: number
	dayOfWeek?: number
	isSpecificDateAndTime?: boolean | undefined
}

export const connectorTestScheduler = async (response: any, data: any) => {
	const presentWorkingDir: any = process.env.PWD
	const serverPath = path.resolve(
		presentWorkingDir,
		`../secure-sight-scheduler/server`,
		// `../orion-scheduler/server`,
	)

	console.log('connector scheduler start!!')

	try {
		let { minute, hour, date, day, repeat, connectorId, userId, dbName } =
			response

		const dbConnection = dynamicModelWithDBConnection(
			dbName,
			COLLECTIONS.CONNECTOR_CONFIG,
		)

		const config_data = await dbConnection
			.findOne({ connectorId: new mongoose.Types.ObjectId(connectorId) })
			.lean()

		let { connectorBasePath, config, connectorFileNameWithExtension }: any =
			config_data

		let argsList: any[] = []

		Object.keys(config).forEach((keyOfSecretData) => {
			const { type, position, isPathArg } = config[keyOfSecretData]
			argsList[position] = isPathArg == 'true'
				? `${serverPath}/${connectorBasePath}/${data[0][keyOfSecretData]}`
				: `--${keyOfSecretData} ${data[0][keyOfSecretData]}`
		})
		let schedulingString: string = ''

		if (repeat.toLowerCase() == 'hourly') {
			schedulingString = `0 * * * *`
		} else if (repeat.toLowerCase() == 'daily') {
			schedulingString = `${minute} ${hour} * * *`
		} else if (repeat.toLowerCase() == 'weekly') {
			schedulingString = `${minute} ${hour} * * ${day}`
		} else if (repeat.toLowerCase() == 'monthly') {
			schedulingString = `${minute} ${hour} ${date < 1 ? 1 : date} * *`
		} else if (repeat.toLowerCase() == 'minute') {
			schedulingString = `*/${minute < 1 ? 1 : minute} * * * *`
		} else {
			schedulingString = `0 */23 * * *`
		}

		let argsOfConnector = argsList.join(' ').trim()
		let command = `python3 ${serverPath}/${connectorBasePath}/${connectorFileNameWithExtension} ${argsOfConnector} > ${serverPath}/${connectorBasePath}.log`
		// let command = `python3 ${serverPath}/${connectorBasePath}/${connectorFileNameWithExtension} ${argsOfConnector} > ${serverPath}/cron.log 2>&1`
		let zipFilePath = path.join(serverPath, connectorBasePath + `.zip`)
		console.log("-------------------the connetor main file is being executed-----------------")
		try {
			await fs.promises.access(`${serverPath}/${connectorBasePath}/${connectorFileNameWithExtension}`, fs.constants.F_OK)
		} catch (e) {
			try {
				await decompress(zipFilePath, path.join(serverPath, connectorBasePath))
			} catch (e) {
				throw e
			}
		}

		const job = scheduler.create(SCHEDULE_JOB_NAME.RUN_PYTHON_COMMAND, { connectorId, command })
		job.unique({ 'data.connectorId': connectorId })
		job.repeatEvery(schedulingString)
		return job.save()

		// return scheduler.every(schedulingString, SCHEDULE_JOB_NAME.RUN_PYTHON_COMMAND, { command })
	} catch (e: any) {
		console.log('Error ::', e.message)
		throw e
	}
}

export const stopTestConnectorScheduler = async (connectorId: string) => {
	const query = { 'data.connectorId': connectorId }
	return scheduler.cancel(query)
}

export default scheduler
