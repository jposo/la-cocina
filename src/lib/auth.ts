import { createAuth0Client, type Auth0Client } from "@auth0/auth0-spa-js";
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import config from "./auth_config";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

// Stores
export const isLoading: Writable<boolean> = writable(false);
export const isAuthenticated: Writable<boolean> = writable(false);
export const user: Writable<any> = writable({});
export const popupOpen: Writable<boolean> = writable(false);
export const error: Writable<string | null> = writable(null);

let auth0Client: Auth0Client;

// Initialize Auth0 client
export async function createClient(): Promise<Auth0Client> {
    if (!browser) {
        throw new Error("Auth0 client can only be created in the browser");
    }

    if (!auth0Client) {
        auth0Client = await createAuth0Client({
            domain: config.domain,
            clientId: config.clientId,
            authorizationParams: {
                redirect_uri: config.redirectUri,
                audience: config.audience,
                scope: config.scope,
            },
            useRefreshTokens: true, // Enable refresh tokens for mobile
            cacheLocation: "localstorage", // Persist tokens across app restarts
        });
    }

    return auth0Client;
}

// Handle app URL open for mobile (Auth0 redirect)
export const handleAppUrlOpen = async () => {
    if (!Capacitor.isNativePlatform()) return;

    const { App } = await import("@capacitor/app");
    const { Browser } = await import("@capacitor/browser");

    App.addListener("appUrlOpen", async (event) => {
        try {
            const url = event?.url;
            if (!url) return;

            if (
                url.includes("state=") &&
                (url.includes("code=") || url.includes("error="))
            ) {
                if (url.includes("callback")) {
                    // Handle redirect and update stores
                    await handleRedirectCallback(url);

                    // Clean up browser history
                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.pathname,
                    );
                }
            }

            // Close the system browser (so user returns to app view)
            await Browser.close();
        } catch (err) {
            console.error("[Auth0] Error handling deep link:", err);
        }
    });
};

// Login with popup (for web)
export async function loginWithPopup(options = {}) {
    if (!browser) return;

    try {
        popupOpen.set(true);
        error.set(null);

        const client = await createClient();
        await client.loginWithPopup(options);

        const userProfile = await client.getUser();
        const authenticated = await client.isAuthenticated();

        user.set(userProfile || {});
        isAuthenticated.set(authenticated);

        if (authenticated) {
            const token = await client.getTokenSilently();
            await fetch(
                "https://aesthetic-sunflower-97a6e4.netlify.app/api/auth/session",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                },
            );
        }
    } catch (e) {
        console.error("Login failed:", e);
        error.set(e instanceof Error ? e.message : "Login failed");
    } finally {
        popupOpen.set(false);
    }
}

// Login with redirect (for web and mobile)
export async function loginWithRedirect(options = {}) {
    if (!browser) return;

    try {
        error.set(null);
        const client = await createClient();
        await client.loginWithRedirect(options);
    } catch (e) {
        console.error("Login redirect failed:", e);
        error.set(e instanceof Error ? e.message : "Login redirect failed");
    }
}

// Handle redirect callback
export async function handleRedirectCallback(url?: string) {
    // alert(`handleRedirectCallback: ${url} `);
    // if (!browser) return;

    try {
        isLoading.set(true);
        error.set(null);

        // alert(`creating client`);
        const client = await createClient();
        // alert(`handling redirect callback`);
        await client.handleRedirectCallback(url);

        // alert(`getting user`);
        const userProfile = await client.getUser();
        // alert(`userProfile: ${userProfile}`);
        const authenticated = await client.isAuthenticated();
        // alert(`authenticated: ${authenticated}`);

        user.set(userProfile || {});
        isAuthenticated.set(authenticated);

        if (authenticated) {
            const token = await client.getTokenSilently();
            await fetch(
                "https://aesthetic-sunflower-97a6e4.netlify.app/api/auth/session",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                },
            );
        }
    } catch (e) {
        alert(`Error: ${e}`);
        console.error("Callback handling failed:", e);
        error.set(e instanceof Error ? e.message : "Authentication failed");
    } finally {
        isLoading.set(false);
    }
}

// Logout
export async function logout(returnTo?: string) {
    if (!browser) return;

    try {
        error.set(null);
        const client = await createClient();

        // Clear local state first
        user.set({});
        isAuthenticated.set(false);

        // Clear the session cookie
        await fetch(
            "https://aesthetic-sunflower-97a6e4.netlify.app/api/auth/session",
            { method: "DELETE" },
        );

        // Determine the return URL
        const logoutUrl =
            returnTo || config.logoutUri || window.location.origin;

        // Logout from Auth0
        await client.logout({
            logoutParams: {
                returnTo: logoutUrl,
            },
        });
    } catch (e) {
        console.error("Logout failed:", e);
        error.set(e instanceof Error ? e.message : "Logout failed");
    }
}

// Get access token
export async function getAccessToken() {
    if (!browser) return null;

    try {
        const client = await createClient();
        return await client.getTokenSilently();
    } catch (e) {
        console.error("Failed to get access token:", e);
        return null;
    }
}

// Initialize auth state
export async function initializeAuth() {
    if (!browser) return;

    try {
        isLoading.set(true);
        error.set(null);

        const client = await createClient();

        // Handle deep links for mobile
        handleAppUrlOpen();

        // Check if we're returning from a redirect on the web
        if (
            window.location.search.includes("code=") &&
            window.location.search.includes("state=")
        ) {
            await handleRedirectCallback();
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
            return;
        }

        // Check if user is already authenticated
        const authenticated = await client.isAuthenticated();

        if (authenticated) {
            const userProfile = await client.getUser();
            user.set(userProfile || {});
            isAuthenticated.set(true);

            const token = await client.getTokenSilently();
            await fetch(
                "https://aesthetic-sunflower-97a6e4.netlify.app/api/auth/session",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                },
            );
        }
    } catch (e) {
        console.error("Auth initialization failed:", e);
        error.set(
            e instanceof Error
                ? e.message
                : "Authentication initialization failed",
        );
    } finally {
        isLoading.set(false);
    }
}

// Auth object with all methods
export const auth = {
    createClient,
    loginWithPopup,
    loginWithRedirect,
    handleRedirectCallback,
    logout,
    getAccessToken,
    initializeAuth,
};

export default auth;
