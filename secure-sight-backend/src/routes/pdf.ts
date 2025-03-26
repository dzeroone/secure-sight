import express from 'express'
import pdfController from '../controllers/pdf.controller';
import { auth } from '../utils/auth-util';
const router = express.Router();

router.post("/monthly",
  auth,
  async (req, res) => {
    try {
      const mergedPdfBuffer = await pdfController.generateMonthlyPdf(req.body)
      // Set response headers correctly and send the PDF as a binary stream
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="merged.pdf"');
      res.setHeader("Content-Length", mergedPdfBuffer.length);

      // Send the PDF buffer as binary
      res.end(Buffer.from(mergedPdfBuffer));
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Failed to generate and merge PDFs", e });
    }
  }
);

router.post("/weekly",
  auth,
  async (req, res) => {
    try {
      const pdfBuffer = await pdfController.generateWeeklyPdf(req.query, req.user!)
      // Set response headers correctly and send the PDF as a binary stream
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="weekly-report.pdf"');
      res.setHeader("Content-Length", pdfBuffer.length);

      // Send the PDF buffer as binary
      res.end(Buffer.from(pdfBuffer));
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Failed to generate and merge PDFs", e });
    }
  }
);

export default router
