export const config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  redirectUri:
    typeof window !== "undefined" ? window.location.origin + "/callback" : "",
  logoutUri: typeof window !== "undefined" ? window.location.origin : "",
  scope: "openid profile email",
};

export default config;
