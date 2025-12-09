// @ts-nocheck
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "250a7045-afff-478e-a113-371d2a6c973d",
    authority: "https://login.microsoftonline.com/cee0b5b3-24f4-464f-bbe0-5b98d38efc64",
    redirectUri: "http://localhost:3000",
  },
};


const loginRequest = {
  scopes: ["User.Read"],
  prompt: "login",   // <-- Force login screen every time
};


const msalInstance = new PublicClientApplication(msalConfig);

export { msalConfig, loginRequest, msalInstance };
