import express, { ErrorRequestHandler, Request, Response } from "express";
import build from "./app";
import path from "path";
import scheduler from './helper/cron.helper'

build().then((app) => {
  scheduler.start()

  // Serve static files in production
  if (process.env.NODE_ENV === 'prod') {
    app.use(express.static(path.resolve(__dirname, "../../client/build")))
    app.get('/*', function (_req: Request, res: Response) {
      res.sendFile(path.resolve(__dirname, "../../client/build/index.html"))
    })
  }

  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

  /**
   * Gracefully stop job scheduler
   */
  async function graceful() {
    await scheduler.stop();
    process.exit(0);
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    graceful();
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception thrown', error);
    graceful();
  });

})