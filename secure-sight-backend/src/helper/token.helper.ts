import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const azureTenantId = process.env.AZURE_TENANT_ID || ''

const jwksClientInstance = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${azureTenantId}/discovery/keys`
});

const getSigningKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  jwksClientInstance.getSigningKey(header.kid).then(key => {
    callback(null, key.getPublicKey())
  }).catch(e => {
    callback(e)
  })
}

export const signAuthToken = (dataToSign: Record<string, any>) => {
  let jwtSecret: any = process.env.jwtSecret
  let jwtSignInExpiresIn = process.env.jwtSignInExpiresIn

  return jwt.sign(dataToSign, jwtSecret, { expiresIn: jwtSignInExpiresIn })
}

export const verifyAzureIdToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getSigningKey, {
      ignoreNotBefore: true
    }, (e, decoded) => {
      if (e) reject(e)
      else resolve(decoded)
    })
  })
}