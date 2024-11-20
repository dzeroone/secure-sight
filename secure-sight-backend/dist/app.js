"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_graphql_1 = require("express-graphql");
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = __importDefault(require("./schema/schema"));
const routes_1 = __importDefault(require("./routes"));
const cron_helper_1 = __importDefault(require("./helper/cron.helper"));
const csvRoutes_1 = __importDefault(require("./routes/csvRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.raw({ type: 'application/octet-stream', limit: '100mb' }));
// Passport Config
app.use(passport_1.default.initialize());
require('./utils/passport')(passport_1.default);
// CORS setup
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Cron Job
const cronJobEmailSender = new cron_helper_1.default();
cronJobEmailSender.schedule.start();
// Routes
app.use('/api', routes_1.default);
app.use('/api', csvRoutes_1.default); // Add this line to include CSV routes
// GraphQL
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    graphiql: true
}));
// MongoDB Connection
const CONNECTION_STRING = `${process.env.mongo_base_url}/${process.env.mongo_db}` || "";
mongoose_1.default.connect(CONNECTION_STRING);
mongoose_1.default.connection.once('open', () => {
    console.log(`Connection to database has been established successfully ${CONNECTION_STRING}`);
});
// Serve static files in production
if (process.env.NODE_ENV === 'prod') {
    app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../client/build")));
    app.get('/*', function (_req, res) {
        res.sendFile(path_1.default.resolve(__dirname, "../../client/build/index.html"));
    });
}
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;
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
// import cronScheduler from './helper/cron.helper'
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
// // Cron Job
// const cronJobEmailSender = new cronScheduler()
// cronJobEmailSender.schedule.start()
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
