import express, { ErrorRequestHandler, Request, Response } from "express";
import build from "./app";
import path from "path";
import scheduler, { SCHEDULE_JOB_NAME } from "./helper/cron.helper";

build().then(async (app) => {
  // Serve static files in production
  if (process.env.NODE_ENV === 'prod') {
    app.use(express.static(path.resolve(__dirname, "../../client/build")))
    app.get('/*', function (_req: Request, res: Response) {
      res.sendFile(path.resolve(__dirname, "../../client/build/index.html"))
    })
  }

  // schedule auto report assignment jobs
  const job1 = scheduler.create(SCHEDULE_JOB_NAME.ASSIGN_REPORTERS, {
    reportType: 'monthly'
  })
  job1.unique({ 'data.reportType': 'monthly' })
  job1.repeatEvery("0 0 1 * *"); //"0 0 1 * *"
  await job1.save()

  const job2 = scheduler.create(SCHEDULE_JOB_NAME.ASSIGN_REPORTERS, {
    reportType: 'weekly'
  })
  job2.unique({ 'data.reportType': 'weekly' })
  job2.repeatEvery("0 0 * * 1")
  await job2.save()
  // -- end of auto assign reporter job

  // schedule auto archive reports jobs
  const monthlyReportArchiveJob = scheduler.create(SCHEDULE_JOB_NAME.ARCHIVE_REPORTS, {
    reportType: 'monthly'
  })
  job1.unique({ 'data.reportType': 'monthly' })
  job1.repeatEvery("0 0 1 * *"); //"0 0 1 * *"
  await job1.save()

  const weeklyReportArchiveJob = scheduler.create(SCHEDULE_JOB_NAME.ARCHIVE_REPORTS, {
    reportType: 'weekly'
  })
  job2.unique({ 'data.reportType': 'weekly' })
  job2.repeatEvery("0 0 * * 1")
  await job2.save()
  // -- end of auto archive reports job

  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

})