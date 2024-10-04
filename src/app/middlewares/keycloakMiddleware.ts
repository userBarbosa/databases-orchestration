// // const Keycloak = require("keycloak-connect");
// // const dotenv = require('dotenv').config();

// import KeycloakConnect, { Keycloak, KeycloakConfig } from "keycloak-connect";

// import { environment } from "../../config/config";

// const config: KeycloakConfig = {
//   realm: environment.KEYCLOAK_REALM,
//   "auth-server-url": `${environment.KEYCLOAK_URL}`, //change to host + port
//   "ssl-required": "external",
//   resource: environment.KEYCLOAK_CLIENT,
//   "bearer-only": true,
//   "confidential-port": "",
// };

// export = new KeycloakConnect({}, config);
// // module.exports = new Keycloak({}, config);

// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//     url: 'http://keycloak-server${kc_base_path}',
//     realm: 'myrealm',
//     clientId: 'myapp'
// });

// try {
//     const authenticated = await keycloak.init();
//     console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
// } catch (error) {
//     console.error('Failed to initialize adapter:', error);
// }

import Keycloak, { KeycloakConfig } from "keycloak-js";
import { environment } from "../../config/config";
import { NextFunction, Request, Response } from "express";

const keycloakConfig: KeycloakConfig = {
  url: environment.KEYCLOAK_URL,
  realm: environment.KEYCLOAK_REALM,
  clientId: environment.KEYCLOAK_CLIENT,
};

const keycloak = new Keycloak(keycloakConfig);

function initializeKeycloak(_app: any) {
//   // Set up session middleware
//   app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true
//   }));

//   // Initialize Keycloak
//   return keycloak.init({
//     onLoad: 'check-sso',
//     silentCheckSsoRedirectUri: process.env.KEYCLOAK_REDIRECT_URI,
//   }).then(() => {
//     console.log('Keycloak initialized');
    
//     // Middleware to refresh the token on each request
//     app.use(async (req, res, next) => {
//       if (keycloak.authenticated) {
//         try {
//           await keycloak.updateToken(5);
//           req.kauth = { grant: { access_token: { token: keycloak.token } } };
//         } catch (error) {
//           console.error('Failed to refresh token', error);
//         }
//       }
//       next();
//     });
//   }).catch(error => {
//     console.error('Failed to initialize Keycloak', error);
//     throw error;
//   });
}

function protectRoute(req: Request, res: Response, next: NextFunction) {
  if (keycloak.authenticated) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

async function getUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | NextFunction> {
  if (!keycloak.authenticated) {
    console.error("User not authenticated");
    return;
  }

  if (!keycloakConfig.url) {
    return;
  }

  const options = {
    hostname: new URL(keycloakConfig.url).hostname,
    port: environment.KEYCLOAK_PORT,
    path: `/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  };

  // const request = request(options, (response) => {
  //   let data = '';
  //   response.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //   response.on('end', () => {
  //     return next(JSON.parse(data))
  //   });
  // });

  // request.on('error', (error) => {
  //   reject(error);
  // });

  // request.end();
}

module.exports = {
  initKeycloak: initializeKeycloak,
  protectRoute,
  getUserInfo,
};
