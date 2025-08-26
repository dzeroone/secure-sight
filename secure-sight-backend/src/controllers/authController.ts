import { UserProps } from '../types/types';
import { sendRegisterInfo, sendUserDetail } from '../utils/auth-util';
import { ROLES, COLLECTIONS, MASTER_ADMIN_DB } from '../constant';
import { dynamicModelWithDBConnection } from '../models/dynamicModel';
import { sendEmail } from '../helper/email.helper';
import { signAuthToken } from '../helper/token.helper';
import passwordResetRequestModel from '../models/password-reset-request.model';
import userController from './user.controller';

class AuthController {
  async register(params: UserProps) {
    return sendRegisterInfo(params);
  }

  async login(params: UserProps) {
    return sendUserDetail(params);
  }

  async azureSignin({ email, name }: { email: string, name: string }) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    let user = await UserModel.findOne({ email }).lean()
    if (!user) {
      const userParams: any = {
        email,
        fullname: name
      }
      const userCount = await UserModel.countDocuments()
      if (userCount > 0) {
        userParams.role = ''
      } else {
        userParams.role = 'admin'
      }

      user = new UserModel(userParams)
      await user.save()
    }
    if (user.status === -1) {
      throw new Error('You are not allowed to sign in, please contact administrator for more information.')
    }
    const token = signAuthToken({ email })
    return {
      token,
      id: user._id,
      email,
      fullname: name,
      role: user.role
    }
  }

  async getPasswordResetRequests(user: Express.User) {
    if(![ROLES.ADMIN, ROLES.LEVEL3].includes(user.role)) return []
    return passwordResetRequestModel.find().lean()
  }

  async getPasswordResetRequestsDetails(user: Express.User) {
    if(![ROLES.ADMIN, ROLES.LEVEL3].includes(user.role)) return []
    const data = await passwordResetRequestModel.find().lean()
    const items = []
    for(let r of data) {
      let item: any = r
      item.user = await userController.getUserById(r.userId!.toString())
      items.push(item)
    }
    return items
  }

  async passwordChanged(userId: string) {
    const r = await passwordResetRequestModel.findOne({
      userId
    })
    if(r) {
      return r.deleteOne()
    }
  }

  async forgot(email: string) {
    const UserModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    let user = await UserModel.findOne({ email }).lean()
    if(!user) throw new Error("Email not found!")
    
    return passwordResetRequestModel.updateOne({
      userId: user._id
    }, {
      $set: {
        userId: user._id,
        cAt: new Date()
      }
    }, {
      new: true,
      upsert: true
    })
  }

  async licenseKey(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let response;
        let dbName = process.env.mongo_db || '';
        const dm = dynamicModelWithDBConnection(
          dbName,
          COLLECTIONS.LICENSE
        );
        const generateRandomString = (len: any) => {
          var text = '';
          var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
          return text;
        };
        const licenseKey = generateRandomString(16);
        const userScheduleData = {
          email: params.email,
          licenseKey: licenseKey,
          expiryDate: params.expiryDate,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const doc = new dm(userScheduleData);
        await doc.save();
        if (doc) {
          let htmlBody = `<h3>Your license key is <b style="color:red;font-size: 20px"> ${licenseKey}</b> and it is expired on <b style="color:red;font-size: 20px"> ${params.expiryDate}</b></h3>`;
          let subjectData = `Congratulations license key is generated successfully!!!!`;
          let emailData = {
            to: params.email,
            html: htmlBody,
            subject: subjectData
          };
          sendEmail(emailData);
          response = {
            success: true,
            status: 200,
            msg: `License key is generated successfully and send to the email`
          };
          resolve(response);
          return;
        } else {
          response = {
            success: false,
            status: 404,
            msg: `failed to generated license key`
          };
          resolve(response);
          return;
        }
      } catch (e: any) {
        let response = {
          success: false,
          status: 500,
          msg: e?.message || 'internal server error'
        };
        throw response;
      }
    });
  }
}

export default new AuthController();
