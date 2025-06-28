import express from "express"
import { auth, hasRole } from "../utils/auth-util";
import countryController from "../controllers/country.controller";
import { ROLES } from "../constant";

const router = express.Router();

router.get("/",
  auth,
  async (req, res) => {
    try {
      const data = await countryController.getAll()
      res.send(data)
    }catch(e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.post('/',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      if(!req.body.title) throw new Error("Invalid")
      await countryController.add(req.body)
      res.send({
        success: true
      })
    }catch(e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.patch('/:id',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      if(!req.body.title) throw new Error("Invalid")
      await countryController.edit(req.params.id, req.body)
      res.send({
        success: true
      })
    }catch(e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

router.delete('/:id',
  auth,
  hasRole(ROLES.ADMIN),
  async (req, res) => {
    try {
      await countryController.delete(req.params.id)
      res.send({
        success: true
      })
    }catch(e: any) {
      res.status(e.status || 400).send({
        success: false,
        message: e.message
      })
    }
  }
)

export default router