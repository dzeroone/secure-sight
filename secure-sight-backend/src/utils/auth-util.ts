import bcryptjs from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { UserProps } from '../types/types'
import jwt from 'jsonwebtoken'
import { dynamicModelWithDBConnection } from '../models/dynamicModel'
import { AUTH, COLLECTIONS, MASTER_ADMIN_DB, ROLES } from '../constant/index'
import passport from 'passport'

declare global {
    namespace Express {
        interface User {
            email: string
            fullname: string
            username: string
            role: string
        }
    }
}

export const setDbName = async (req: Request<UserProps>, _res: Response, next: NextFunction) => {
    if ([ROLES.ROLE2, ROLES.ROLE3].includes(req.body.role)) {
        const dm = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.TENANT)
        const user = await dm.findOne({ tenantCode: req.body.tenantCode }).lean()
        req.body.dbName = user?.dbName
        req.body.companyName = user?.companyName
    } else {
        req.body.dbName = MASTER_ADMIN_DB
    }
    next()
}

async function matchCredential(params: any, user: any) {
    let jwtSecret: any = process.env.jwtSecret
    let jwtSignInExpiresIn = process.env.jwtSignInExpiresIn
    const isMatch = await bcryptjs.compare(params.password, user.password)
    if (isMatch) {
        delete params.password;
        const token = jwt.sign(params, jwtSecret, { expiresIn: jwtSignInExpiresIn })
        params.username = user.username;
        params.role = user.role;
        params.id = user._id;

        let name = (params.role === "tenant_admin") ? `${user.companyName}` : `${user.username}`
        return {
            success: true,
            status: 200,
            data: { token, ...params },
            msg: name + ` successfully login`
        }
    } else {
        return {
            success: false,
            status: 422,
            msg: AUTH.WARNING_1
        }
    }
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
    const userModel = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
    let user = await userModel.findOne({ email: params.email })
    if (user) {
        throw new Error(AUTH.USER_EXIST)
    } else {
        const userCount = await userModel.countDocuments()
        if (userCount > 0) {
            params.role = ''
        } else {
            params.role = 'admin'
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(params.password, salt)
        params.password = hashedPassword
        const doc = new userModel(params)
        await doc.save()
        return userModel.findOne({ email: params.email }, { password: 0 })
    }
}

export const hasRole = (role: string | string[]) => async (req: Request, _res: Response, next: NextFunction) => {
    const err: any = new Error('Unauthorized')
    err.status = 401

    if (!req.user?.role) {
        next(err)
        return
    }
    const chRoles = Array.isArray(role) ? role : [role]
    if (chRoles.indexOf(req.user.role) < 0) {
        next(err)
        return
    }
    next()
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    let responseObj = {
        statusCode: 0,
        errorMsg: "",
        data: {}
    }
    passport.authenticate('jwt', (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            responseObj.data = info?.message
            responseObj.statusCode = 401
            responseObj.errorMsg = "user is not authenticated!!!!"
            return res.status(responseObj.statusCode).json(responseObj)
        }
        req.user = user;
        next();
    })(req, res, next);
}