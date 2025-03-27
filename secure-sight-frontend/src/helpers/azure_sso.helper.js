import * as msal from "@azure/msal-browser"

const clientId = process.env.REACT_APP_AZURE_CLIENT_ID
const tenantId = process.env.REACT_APP_AZURE_TENANT_ID
const redirectUri = process.env.REACT_APP_AZURE_REDIRECT_URI

export const getMSALApplication = async () => {
  return msal.createStandardPublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri
    }
  })
};