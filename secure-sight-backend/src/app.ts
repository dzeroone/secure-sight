import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'
import passport from 'passport'
import fileUpload from 'express-fileupload'
import os from 'os'
dotenv.config()

import { mkdir } from 'fs/promises'
import { REPORT_DIR } from './constant'
import './helper/yup.helper'
import routes from './routes'
import csvRoutes from './routes/csvRoutes'
import schema from './schema/schema'

const build = async () => {

    //saas
    const app: Application = express()

    // Middleware
    app.use(cors())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json({ limit: '50mb' }))
    app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }))

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true,
        tempFileDir: os.tmpdir()
    }));

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

    // create necessary directories
    await mkdir(REPORT_DIR, { recursive: true })

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
    await mongoose.connect(CONNECTION_STRING)
    mongoose.connection.once('open', () => {
        console.log(`Connection to database has been established successfully ${CONNECTION_STRING}`)
    })

    // create necessary elastic indices for saving monthly and weekly form data from report generation tool
    // createElasticIndices()

    const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(err.status || 500)
        res.send({ error: err?.message || err })
    }

    app.use(errorHandler)

    return app
}

export default build











// import path from 'path'
// import mongoose from 'mongoose'
// import { graphqlHTTP } from 'express-graphql'
// import passport from 'passport'
// import cors from 'cors'
// import express, { Application, Request, Response, NextFunction } from 'express'
// import multer from 'multer'
// import { exec } from 'child_process'
// import dotenv from 'dotenv'
// import fs from 'fs'
// import helmet from 'helmet'
// import compression from 'compression'
// import rateLimit from 'express-rate-limit'

// // Import routes and helpers
// import schema from './schema/schema'
// import routes from './routes'
// import csvRoutes from './routes/csvRoutes'
// import errorHandler from './middleware/errorHandler'
// import logger from './utils/logger'

// dotenv.config()

// const app: Application = express()

// // Security Middleware
// app.use(helmet())
// app.use(compression())

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// })
// app.use(limiter)

// // Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }))
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json({ limit: '50mb' }))
// app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }))

// // File upload configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   }
// })
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB file size limit
//   }
// })

// // Passport Configuration
// app.use(passport.initialize())
// require('./utils/passport')(passport)

// // Logging Middleware
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.path}`)
//   next()
// })

// // Routes
// app.use('/api', routes)
// app.use('/api', csvRoutes)

// // Python Script Upload Endpoint
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, req.file.path);

//   exec(`python3 "${filePath}"`, (error, stdout, stderr) => {
//     // Ensure file is always cleaned up
//     try {
//       fs.unlinkSync(filePath);
//     } catch (unlinkError) {
//       logger.error('Error deleting uploaded file:', unlinkError);
//     }

//     if (error) {
//       logger.error(`exec error: ${error}`);
//       logger.error(`stderr: ${stderr}`);
//       return res.status(500).json({ error: 'Error executing Python script' });
//     }

//     res.json({ output: stdout });
//   });
// });

// // GraphQL
// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: process.env.NODE_ENV !== 'production'
// }))

// // MongoDB Connection
// const CONNECTION_STRING: string = `${process.env.MONGO_BASE_URL}/${process.env.MONGO_DB}` || ""
// mongoose.connect(CONNECTION_STRING)
//   .then(() => logger.info(`Database connected: ${CONNECTION_STRING}`))
//   .catch((err) => logger.error('Database connection error:', err))

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.resolve(__dirname, "../../client/build")))
//   app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, "../../client/build/index.html"))
//   })
// }

// // Global Error Handler
// app.use(errorHandler)

// // 404 Handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: 'Not Found' })
// })

// // Port configuration
// const PORT: number = parseInt(process.env.PORT || '5001')
// const server = app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`)
// })

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM signal received: closing HTTP server')
//   server.close(() => {
//     logger.info('HTTP server closed')
//     mongoose.connection.close(false, () => {
//       logger.info('MongoDB connection closed')
//       process.exit(0)
//     })
//   })
// })

// export default app