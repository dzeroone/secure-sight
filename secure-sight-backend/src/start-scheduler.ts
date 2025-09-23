import build from "./app";
import scheduler from "./helper/cron.helper";

build().then((app) => {
  scheduler.start()
  
  console.log("Schedule processor started")
  
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