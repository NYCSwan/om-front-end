import AWS from 'aws-sdk';
import { CognitoUserPool } from "amazon-cognito-identity-js";
import config from "../config";
import sigV4Client from "./sigV4Client";

// call API Gateway with signed request
export async function invokeApig({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  body
}) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }
  // resolve url path
  let url = "";
  if (path.includes('gardens')) {
    url = config.apiGateway.GARDENS_URL;
  } else if(path.includes('chambers')){
    url = config.apiGateway.CHAMBERS_URL;
  } else if(path.includes('climates')){
    url = config.apiGateway.CLIMATES_URL;
  } else if(path.includes('sensorData')){
    url = config.apiGateway.IOT_DATA_URL;
  } else if(path.includes('sensors')){
    url = config.apiGateway.SENSORS_URL;
  } else if (path.includes('images')){
    url = config.apiGateway.IMAGES_URL;
  } else if(path.includes('plants')){
    url = config.apiGateway.PLANT_RECIPE_URL;
  } else {
    console.error('path is missing, no url can be provided.');
  }

  const signedRequest = sigV4Client
  .newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: config.apiGateway.REGION,
    endpoint: url })
  .signRequest({
    method,
    path,
    headers,
    queryParams,
    body });

    body = body ? JSON.stringify(body) : body; // eslint-disable-line
    headers = signedRequest.headers; // eslint-disable-line
    // http fetch req
    const results = await fetch(signedRequest.url, {
      method,
      headers,
      body
    });

    if (results.status !== 200) {
      alert(results.text());
      throw new Error(await results.text());
    }
    return results.json();
}

  function getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    console.log(userPool.ClientId);
    return userPool.getCurrentUser();
  }

export function signOutUser() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
  }
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) { // eslint-disable-line
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.cognito
    .REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}

export async function authUser() {
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return true;
  }

  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

  const userToken = await getUserToken(currentUser);
  await getAwsCredentials(userToken);
  return true;
}
