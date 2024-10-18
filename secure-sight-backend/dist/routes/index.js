"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("./auth"));
const master_admin_1 = __importDefault(require("./master-admin"));
const tenant_admin_1 = __importDefault(require("./tenant-admin"));
const connector_1 = __importDefault(require("./connector"));
const upload_connector_1 = __importDefault(
  require("./upload/upload-connector"),
);
const elastic_1 = __importDefault(require("./elastic"));
const dashboard_1 = __importDefault(require("./dashboard"));
const report_1 = __importDefault(require("./report"));
const mail_scheduler_1 = __importDefault(require("./mail-scheduler"));
router.use("/auth", auth_1.default);
router.use("/master", master_admin_1.default);
router.use("/tenant", tenant_admin_1.default);
router.use("/connector", connector_1.default);
router.use("/upload-connector", upload_connector_1.default);
router.use("/elastic", elastic_1.default);
router.use("/dashboard", dashboard_1.default);
router.use("/report", report_1.default);
router.use("/schedule", mail_scheduler_1.default);
exports.default = router;
