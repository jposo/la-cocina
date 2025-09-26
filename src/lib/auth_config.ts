import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "$env/static/private";

export const config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: undefined,
  redirectUri:
    typeof window !== "undefined" ? window.location.origin + "/callback" : "",
  logoutUri: typeof window !== "undefined" ? window.location.origin : "",
  scope: "openid profile email",
};

export default config;
