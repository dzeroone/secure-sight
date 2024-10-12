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
