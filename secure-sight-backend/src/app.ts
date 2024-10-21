import path from 'path'
import mongoose from 'mongoose'
import { graphqlHTTP } from 'express-graphql'
import passport from 'passport'
import cors from 'cors'
import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import schema from './schema/schema'
import routes from './routes'
import cronScheduler from './helper/cron.helper'
import csvRoutes from './routes/csvRoutes'

dotenv.config()

const app: Application = express()


// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }))

// Passport Config
app.use(passport.initialize())
require('./utils/passport')(passport)

// CORS setup
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

// Cron Job
const cronJobEmailSender = new cronScheduler()
cronJobEmailSender.schedule.start()

// Routes
app.use('/api', routes)
app.use('/api', csvRoutes)  // Add this line to include CSV routes

// GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

// MongoDB Connection
const CONNECTION_STRING: string = `${process.env.mongo_base_url}/${process.env.mongo_db}` || ""
mongoose.connect(CONNECTION_STRING)
mongoose.connection.once('open', () => {
    console.log(`Connection to database has been established successfully ${CONNECTION_STRING}`)
})

// Serve static files in production
if (process.env.NODE_ENV === 'prod') {
    app.use(express.static(path.resolve(__dirname, "../../client/build")))
    app.get('/*', function (_req: Request, res: Response) {
        res.sendFile(path.resolve(__dirname, "../../client/build/index.html"))
    })
}

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app