import express, { Request, Response } from 'express'
const router = express.Router();
import connectorController from '../controllers/connectorController'
import { ConnectorProps } from '../types/types'
import { upload } from '../helper/fileUpload.helper'
import { auth, hasRole } from '../utils/auth-util';
import { ROLES } from '../constant';

router.post('/add-update-connector', async (req: Request<ConnectorProps>, res: Response) => {
    let data = await connectorController.createUpdateConnector(req.body)
    res.send(data)
})

router.post('/insert-multi-connector', async (req: Request, res: Response) => {
    let data = await connectorController.insertMultiConnector(req.body)
    res.send(data)
})

router.get('/connector-list', async (req: Request, res: Response) => {
    let data = await connectorController.connectorList()
    res.send(data)
})

router.post('/activate-connector', async (req: Request, res: Response) => {
    let data = await connectorController.activateConnector(req.body)
    res.send(data)
})

router.post('/share-connector', async (req: Request, res: Response) => {
    let data = await connectorController.shareConnector(req.body)
    res.send(data)
})

router.post('/delete-connectorByMaster', async (req: Request, res: Response) => {
    let data = await connectorController.masterDeleteConnector(req.body)
    res.send(data)
})

router.post('/delete-connectorByTenant',
    auth,
    hasRole(ROLES.ADMIN),
    async (req: Request, res: Response) => {
        let data = await connectorController.tenantDeleteConnector(req.body, req.user!)
        res.send(data)
    }
)

router.post('/shareConnectorToUser', async (req: Request, res: Response) => {
    let data = await connectorController.asignConnector(req.body)
    res.send(data)
})

router.post('/connectorListForUser', async (req: Request, res: Response) => {
    let data = await connectorController.connectorListForUser(req.body)
    res.send(data)
})

router.post('/schedule', async (req: Request, res: Response) => {
    let data = await connectorController.connectorScheduleTest(req.body)
    res.send(data)
})

router.post('/add-connector-config', upload.single('file'), async (req: Request, res: Response) => {
    let data = await connectorController.connectorSchedulingDataInsert(req.body)
    res.send(data)
})

router.post('/:id', async (req, res) => {
    try {
        const response = await connectorController.invokeConnector(req.params.id)
        res.json(response)
    } catch (e) {
        res.status(400).send(e)
    }
})

export default router;