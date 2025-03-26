import * as msal from "@azure/msal-browser"

const clientId = process.env.REACT_APP_AZURE_CLIENT_ID
const redirectUri = process.env.REACT_APP_AZURE_REDIRECT_URI

export const msalApplication = msal.createStandardPublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${clientId}`,
    redirectUri
  },
});