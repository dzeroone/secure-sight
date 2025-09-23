import puppeteer from "puppeteer";
import ejs from 'ejs';
import { PDFDocument } from "pdf-lib";
import path from "path";
import { signAuthToken } from "../helper/token.helper";
import { pluralize } from "../helper/string.helper";
import { CHART_EXTRAS } from "../constant";

class PdfController {
  async generateMonthlyPdf(data: any) {
    try {
      const browser = await puppeteer.launch({
        headless: 'shell',
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--headless",
          "--no-zygote",
          "--disable-gpu",
        ]
      });

      // Generate the first PDF
      const html1 = await ejs.renderFile(path.resolve("./src/pdf-template/firstPage.ejs"), {
        data,
      });
      const page1 = await browser.newPage();
      await page1.setContent(html1, {
        waitUntil: ["load", "networkidle0", "domcontentloaded"],
      });
      const pdf2Buffer = await page1.pdf({
        format: "A4",
        printBackground: true,
      });

      // Generate the second PDF
      const html2 = await ejs.renderFile(path.resolve("./src/pdf-template/pdf.ejs"), { data, pluralize, CHART_EXTRAS });
      const page2 = await browser.newPage();
      await page2.setContent(html2, {
        waitUntil: ["load", "networkidle0", "domcontentloaded"],
      });
      const pdf1Buffer = await page2.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
          top: "0.5in",
          bottom: "0.5in",
        },
        headerTemplate: `<div></div>`,
        footerTemplate: `<div class="footer" style="font-size: 12px; width: 100%; display: flex; justify-content: flex-end; align-items: center; margin: 0; gap: 10px; padding-right: 30px; margin-bottom: -10px">
                    <img src="data:image/png;base64,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" style="width: 94px; height: 30px; object-fit: contain" />
                    <span style="margin: 0;"> | </span>
                    <span><span class="pageNumber" style="margin: 0;"></span> of <span class="totalPages" style="margin: 0"></span></span>
                  </div>`,
      });

      await browser.close();

      // Merge PDFs using pdf-lib
      const mergedPdf = await PDFDocument.create();
      const pdf1Doc = await PDFDocument.load(pdf1Buffer);
      const pdf2Doc = await PDFDocument.load(pdf2Buffer);

      const pdf1Pages = await mergedPdf.copyPages(
        pdf1Doc,
        pdf1Doc.getPageIndices()
      );
      const pdf2Pages = await mergedPdf.copyPages(
        pdf2Doc,
        pdf2Doc.getPageIndices()
      );

      pdf2Pages.forEach((page) => mergedPdf.addPage(page));
      pdf1Pages.forEach((page) => mergedPdf.addPage(page));

      return mergedPdf.save();
      // res.render("pdf.ejs", { data: data });
    } catch (error) {
      throw error;
    }
  }

  async generateWeeklyPdf(query: any, user: Express.User) {
    try {
      const fontendBase = process.env.WEEKLY_REPORT_FONTEND_BASEURL || "http://localhost:3003"

      const browser = await puppeteer.launch({
        headless: 'shell',
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--headless",
          "--no-zygote",
          "--disable-gpu",
        ]
      });

      const page = await browser.newPage();
      await page.goto(fontendBase);

      await page.evaluateOnNewDocument(
        (authData) => {
          localStorage.clear();
          localStorage.setItem('redux_state', JSON.stringify(authData));
        },
        {
          login: {
            user: {
              email: user.email,
              id: user._id,
              role: user.role,
              token: signAuthToken({ email: user.email }),
            }
          }
        }
      );

      const params = new URLSearchParams(query)
      params.set("print", "true")

      await page.goto(`${fontendBase}/dashboard?${params.toString()}`, {
        waitUntil: ["load", "networkidle0", "domcontentloaded"],
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        displayHeaderFooter: false
      });

      await browser.close();

      return pdfBuffer;
      // res.render("pdf.ejs", { data: data });
    } catch (error) {
      throw error;
    }
  }
}

export default new PdfController()
