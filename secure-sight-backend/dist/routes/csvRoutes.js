"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const router = express_1.default.Router();
// Create a schema for CSV data
const CsvDataSchema = new mongoose_1.Schema({
    document_name: { type: String, required: true },
    user_id: { type: String, required: true },
    upload_date: { type: Date, default: Date.now },
    data: { type: [mongoose_1.Schema.Types.Mixed], required: true }, // Array of mixed types
});
// Create a model for the CSV data
const CsvDataModel = mongoose_1.default.model("CSVData", CsvDataSchema);
// Route to upload CSV data
router.post("/document/upload-document", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Incoming request body:", req.body); // Log the request body
    // Retrieve document name and data from the request body
    const documentName = req.body.info.document_name; // Adjusted to access the document name correctly
    const data = req.body.data; // Assuming data is passed in the request body
    // Validate required fields
    if (!documentName || !data) {
        return res
            .status(400)
            .json({ success: false, msg: "Document name and data are required" });
    }
    try {
        const dbName = "secure-sight"; // Hardcoded database name
        const user_id = "6704c7e61118b252ff43f13"; // Hardcoded user ID
        const db = mongoose_1.default.connection.useDb(dbName);
        const newCsvData = new CsvDataModel({
            document_name: documentName,
            user_id,
            data: data.data, // Assuming data.data is the array of objects you want to save
        });
        yield newCsvData.save();
        res.json({ success: true, msg: "CSV data uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading CSV data:", error);
        res.status(500).json({ success: false, msg: "Error uploading CSV data" });
    }
}));
// Route to fetch all CSV documents
router.get("/document/document-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbName = "secure-sight"; // Hardcoded database name
        const db = mongoose_1.default.connection.useDb(dbName);
        const documents = yield CsvDataModel.find({}, "document_name upload_date user_id").sort({ upload_date: -1 });
        res.json({ success: true, data: documents });
    }
    catch (error) {
        console.error("Error fetching document list:", error);
        res
            .status(500)
            .json({ success: false, msg: "Error fetching document list" });
    }
}));
// Route to fetch a specific CSV document by ID
router.get("/document/get-document/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the document ID from the route parameters
    try {
        const dbName = "secure-sight"; // Hardcoded database name
        const db = mongoose_1.default.connection.useDb(dbName);
        // Find the document by ID
        const document = yield CsvDataModel.findById(id);
        if (!document) {
            return res
                .status(404)
                .json({ success: false, msg: "Document not found" });
        }
        res.json({ success: true, data: document }); // Return the found document
    }
    catch (error) {
        console.error("Error fetching document by ID:", error);
        res.status(500).json({ success: false, msg: "Error fetching document" });
    }
}));
exports.default = router;
