export const config = {
  domain: "dev-uyn6xmq8qejklrwh.us.auth0.com",
  clientId: "tz02iEcTKBRdJEw1jN2pThRf6AvHbHL6",
  audience: undefined,
  redirectUri:
    typeof window !== "undefined" ? window.location.origin + "/callback" : "",
  logoutUri: typeof window !== "undefined" ? window.location.origin : "",
  scope: "openid profile email",
};

export default config;
