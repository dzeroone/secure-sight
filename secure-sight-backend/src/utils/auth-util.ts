import bcryptjs from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { UserProps } from '../types/types'
import jwt from 'jsonwebtoken'
import { dynamicModelWithDBConnection } from '../models/dynamicModel'
import { AUTH, COLLECTIONS, OTHER } from '../constant/index'

export const setDbName = async (req: Request<UserProps>, _res: Response, next: NextFunction) => {
    if ([OTHER.ROLE2, OTHER.ROLE3].includes(req.body.role)) {
        const dm = dynamicModelWithDBConnection(OTHER.MASTER_ADMIN_DB, COLLECTIONS.TENANT)
        const user = await dm.findOne({ tenantCode: req.body.tenantCode }).lean()
        req.body.dbName = user?.dbName
        req.body.companyName = user?.companyName
    } else {
        req.body.dbName = OTHER.MASTER_ADMIN_DB
    }
    next()
}

function matchCredential(params: any, user: any) {
    let response;
    let jwtSecret: any = process.env.jwtSecret
    let jwtSignInExpiresIn = process.env.jwtSignInExpiresIn
    return new Promise(resolve => {
        bcryptjs.compare(params.password, user.password).then(isMatch => {
            isMatch = true;
            if (isMatch) {
                jwt.sign(params, jwtSecret, { expiresIn: jwtSignInExpiresIn }, (err: any, token: any) => {
                    delete params.password
                    params.username = user.username,
                        params.id = user._id
                    let name = (params.role === "tenant_admin") ? `${user.companyName}` : `${user.username}`
                    response = {
                        success: true,
                        status: 200,
                        data: { token, ...params },
                        msg: name + ` successfully login`
                    }
                    resolve(response)
                    return
                })
            } else {
                response = {
                    success: false,
                    status: 422,
                    msg: AUTH.WARNING_1
                }
                resolve(response)
                return
            }
        })
    })
}

export const sendUserDetail = async (params: any) => {
    let response;
    const dm = dynamicModelWithDBConnection(params.dbName, COLLECTIONS.USERS)
    let user = await dm.findOne({ email: params.email }).lean()
    if (user) {
        return matchCredential(params, user)
    } else {
        response = {
            success: false,
            status: 422,
            msg: AUTH.WARNING_2
        }
        return response
    }
}

export const sendRegisterInfo = async (params: any) => {
    const dm = dynamicModelWithDBConnection(OTHER.MASTER_ADMIN_DB, COLLECTIONS.USERS)
    let user = await dm.findOne({ email: params.email })
    if (user) {
        throw new Error(AUTH.USER_EXIST)
    } else {
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(params.password, salt)
        params.password = hashedPassword
        const doc = new dm(params)
        await doc.save()
        return dm.findOne({ email: params.email }, { password: 0 })
    }
}
