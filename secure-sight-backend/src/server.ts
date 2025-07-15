import express, { ErrorRequestHandler, Request, Response } from "express";
import build from "./app";
import path from "path";

build().then((app) => {
  // Serve static files in production
  if (process.env.NODE_ENV === 'prod') {
    app.use(express.static(path.resolve(__dirname, "../../client/build")))
    app.get('/*', function (_req: Request, res: Response) {
      res.sendFile(path.resolve(__dirname, "../../client/build/index.html"))
    })
  }

  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

})