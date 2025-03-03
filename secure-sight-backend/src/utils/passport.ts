import { ExtractJwt, Strategy } from 'passport-jwt'
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { COLLECTIONS } from "../constant"

module.exports = (passport: any) => {
    passport.use(
        new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwtSecret || ''
        }, async (jwt_payload: any, done: any) => {
            const dm = dynamicModelWithDBConnection("secure-sight", COLLECTIONS.USERS)
            // const dm = await dynamicModelWithDBConnection("orion", COLLECTIONS.USERS)
            const user = await dm.findOne({ email: jwt_payload.email }, { password: 0 }).lean()
            return user ? done(null, user) : done(null, false)
        })
    )
}
