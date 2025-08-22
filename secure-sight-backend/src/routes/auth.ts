import express, { Request, Response } from 'express';
import { default as AuthController, default as authController } from '../controllers/authController';
import { verifyAzureIdToken } from '../helper/token.helper';
import { UserProps } from '../types/types';
import { auth } from '../utils/auth-util';
import logger from '../utils/logger';
const router = express.Router();

// router.post('/register', async (req: Request<UserProps>, res: Response) => {
//     try {
//         let data = await AuthController.register(req.body)
//         res.send({
//             success: true,
//             data
//         })
//     } catch (e: any) {
//         res.status(400).send({
//             success: false,
//             data: {
//                 message: e.message
//             }
//         })
//     }
// })

router.post('/login',
    // CompareDate,
    async (req: Request<UserProps>, res: Response) => {
        try {
            const data = await AuthController.login(req.body);

            if (!data) {
                return res.status(401).json({ message: 'Invalid credentials' }); // Handle invalid login attempts
            }

            res.status(200).json(data); // Send back user data or token on successful login
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: 'Internal Server Error' }); // Generic error message for server issues
        }
    }
);

router.post('/azure-ad', async (req, res) => {
  if (!req.body.token) throw new Error("Token not provided")
  const token = req.body.token
  try {
    const decoded: any = await verifyAzureIdToken(token)
    const data = await authController.azureSignin({
      email: decoded.preferred_username,
      name: decoded.name
    })
    
    logger.info({
      msg: `${data.fullname || data.email} has been signed in using azure ad`,
      data: {
        id: data.id,
        email: data.email,
        fullname: data.fullname,
        role: data.role
      },
    })

    res.send(data)
  } catch (e: any) {
    logger.error({
      msg: e.message
    })
    res.status(e.status || 400).send({ message: e.message })
  }
})

router.post('/info',
  auth,
  async (req: Request, res: Response) => {
    res.send(req.user)
  }
)

router.post('/generate-license-key', async (req: Request<UserProps>, res: Response) => {
  let data = await AuthController.licenseKey(req.body)
  res.send(data)
})

export default router;