import express from 'express'
import notificationModel from '../models/notificationModel';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await notificationModel.find().sort({
    updatedAt: -1
  }).limit(20).lean()
  return res.json(data)
})

export default router