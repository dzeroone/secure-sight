import jwt from 'jsonwebtoken'

export const signAuthToken = (dataToSign: Record<string, any>) => {
  let jwtSecret: any = process.env.jwtSecret
  let jwtSignInExpiresIn = process.env.jwtSignInExpiresIn

  return jwt.sign(dataToSign, jwtSecret, { expiresIn: jwtSignInExpiresIn })
}