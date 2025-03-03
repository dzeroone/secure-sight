import express, { Request, Response } from 'express'
const router = express.Router();
import TenantAdminController from '../../controllers/tenant-admin-controller'
import { UserProps } from '../../types/types'

router.post('/add-update-user', async (req: Request<UserProps>, res: Response) => {
    let data = await TenantAdminController.addUpdateUser(req.body)
    res.send(data)
})

router.post('/user-list', async (req: Request, res: Response) => {
    let data = await TenantAdminController.userList(req.body)
    res.send(data)
})

router.post('/delete-user', async (req: Request, res: Response) => {
    let data = await TenantAdminController.deleteUser(req.body)
    res.send(data)
})

export default router;
