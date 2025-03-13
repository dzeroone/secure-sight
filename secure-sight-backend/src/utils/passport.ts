import { ExtractJwt, Strategy } from 'passport-jwt'
import { dynamicModelWithDBConnection } from "../models/dynamicModel"
import { COLLECTIONS, MASTER_ADMIN_DB } from "../constant"

module.exports = (passport: any) => {
    passport.use(
        new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwtSecret || ''
        }, async (jwt_payload: any, done: any) => {
            const dm = dynamicModelWithDBConnection(MASTER_ADMIN_DB, COLLECTIONS.USERS)
            // const dm = await dynamicModelWithDBConnection("orion", COLLECTIONS.USERS)
            const user = await dm.findOne({ email: jwt_payload.email }, { password: 0 }).lean()
            return user ? done(null, {
                _id: user._id.toString(),
                fullname: user.fullname,
                role: user.role
            }) : done(null, false)
        })
    )
}
