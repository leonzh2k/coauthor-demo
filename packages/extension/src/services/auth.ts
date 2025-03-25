import { KJUR, b64utoutf8 } from "jsrsasign";
import { captureException } from "@sentry/browser";

const CLIENT_ID = encodeURIComponent(process.env.CLIENT_ID);
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent(process.env.REDIRECT_URI);

const STATE = encodeURIComponent("jkls3n");
const SCOPE = encodeURIComponent("openid");
const PROMPT = encodeURIComponent("consent");

function createOauth2URL() {
  const nonce = encodeURIComponent(
    Math.random().toString(36).slice(2, 15) +
      Math.random().toString(36).slice(2, 15)
  );
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`;
  return url;
}

const verifyIDToken = (token: string) => {
  const user_info: any = KJUR.jws.JWS.readSafeJSONString(
    b64utoutf8(token.split(".")[1])
  );
  if (
    (user_info!.iss === "https://accounts.google.com" ||
      user_info.iss === "accounts.google.com") &&
    user_info!.aud === CLIENT_ID
  ) {
    return true;
  }

  return false;
};

const extractIDToken = (redirectURL: string) => {
  let token = redirectURL.slice(
    Math.max(0, redirectURL.indexOf("id_token=") + 9)
  );

  token = token.slice(0, Math.max(0, token.indexOf("&")));
  return token;
};

export const authenticate = async () => {
  let redirectURL;
  try {
    // Throws an error if user closes auth window
    redirectURL = await chrome.identity.launchWebAuthFlow({
      url: createOauth2URL(),
      interactive: true,
    });
  } catch {
    return false;
  }

  if (!redirectURL || redirectURL.includes("error=access_denied")) {
    return false;
  }

  const idToken = extractIDToken(redirectURL);

  if (!verifyIDToken(idToken)) {
    return false;
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error(error);
    captureException(error);
    return false;
  }

  return true;
};
