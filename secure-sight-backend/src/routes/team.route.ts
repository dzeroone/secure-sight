import express from "express";
import { auth, hasRole } from "../utils/auth-util";
import { ROLES } from "../constant";
import teamController from "../controllers/team.controller";
import logger from "../utils/logger";

const router = express.Router();

router.post("/",
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      const data = await teamController.add(req.body.name)
      
      logger.info({
        msg: `${req.user?.email} has added a new team`
      })
      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get("/",
  auth,
  async (req, res) => {
    try {
      const data = await teamController.getAll()
      res.send(data)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.get("/:id",
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      const data = await teamController.getById(req.params.id)
      if (!data) {
        throw new Error('Not found!')
      }
      res.send(data.toObject())
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.patch("/:id",
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      const data = await teamController.getById(req.params.id)
      if (!data) {
        throw new Error('Not found!')
      }
      await teamController.update(data, req.body.name)

      logger.info({
        msg: `${req.user?.email} has updated ${data.name} to ${req.body.name}`
      })

      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

router.delete("/:id",
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      const data = await teamController.getById(req.params.id)
      if (!data) {
        throw new Error('Not found!')
      }
      await teamController.delete(data)

      logger.info({
        msg: `${req.user?.email} has deleted ${data.name} team`
      })

      res.sendStatus(200)
    } catch (e: any) {
      res.status(e.status || 400).send({
        message: e.message
      })
    }
  }
)

export default router