import express from 'express'
const router = express.Router()
import auth from './auth'
import master from './master-admin'
import tenant from './tenant-admin'
import connector from './connector'
import uploadConnector from './upload/upload-connector'
import elastic from './elastic'
import dashboard from './dashboard'
import report from './report'
import mailScheduler from './mail-scheduler'
import notificationRouter from './notification'
import userRouter from './user/index'
import customerRouter from './customers/index'
import assignmentRouter from './assignments'



router.use('/auth', auth)
router.use('/master', master)
router.use('/tenant', tenant)
router.use('/connector', connector)
router.use('/upload-connector', uploadConnector)
router.use('/elastic', elastic)
router.use('/dashboard', dashboard)
router.use('/report', report)
router.use('/schedule', mailScheduler)
router.use('/notifications', notificationRouter)
router.use('/users', userRouter)
router.use('/customers', customerRouter)
router.use('/assignments', assignmentRouter)

export default router
