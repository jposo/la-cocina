import { Capacitor } from "@capacitor/core";

const isMobile = Capacitor.isNativePlatform();

const mobileConfig = {
    domain: "dev-uyn6xmq8qejklrwh.us.auth0.com",
    clientId: "tz02iEcTKBRdJEw1jN2pThRf6AvHbHL6",
    audience: undefined,
    redirectUri: "com.lacocina.app://auth-callback/callback",
    logoutUri: "com.lacocina.app://auth-callback",
    scope: "openid profile email offline_access",
};

const webConfig = {
    domain: "dev-uyn6xmq8qejklrwh.us.auth0.com",
    clientId: "tz02iEcTKBRdJEw1jN2pThRf6AvHbHL6",
    audience: undefined,
    redirectUri:
        typeof window !== "undefined"
            ? window.location.origin + "/callback"
            : "",
    logoutUri: typeof window !== "undefined" ? window.location.origin : "",
    scope: "openid profile email",
};

export const config = isMobile ? mobileConfig : webConfig;

export default config;
