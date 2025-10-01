import { createAuth0Client, type Auth0Client } from "@auth0/auth0-spa-js";
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import config from "./auth_config";

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
    });
  }

  return auth0Client;
}

// Login with popup
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
  } catch (e) {
    console.error("Login failed:", e);
    error.set(e instanceof Error ? e.message : "Login failed");
  } finally {
    popupOpen.set(false);
  }
}

// Login with redirect
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
export async function handleRedirectCallback() {
  if (!browser) return;

  try {
    isLoading.set(true);
    error.set(null);

    const client = await createClient();
    await client.handleRedirectCallback();

    const userProfile = await client.getUser();
    const authenticated = await client.isAuthenticated();

    user.set(userProfile || {});
    isAuthenticated.set(authenticated);
  } catch (e) {
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

    // Determine the return URL
    const logoutUrl = returnTo || config.logoutUri || window.location.origin;

    console.log("Auth0 logout attempt:", {
      returnTo: logoutUrl,
      domain: config.domain,
      clientId: config.clientId,
    });

    // Logout from Auth0
    await client.logout({
      logoutParams: {
        returnTo: logoutUrl,
      },
    });
  } catch (e) {
    console.error("Logout failed with details:", {
      error: e,
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
      returnTo: returnTo || config.logoutUri || window.location.origin,
    });
    error.set(e instanceof Error ? e.message : "Logout failed");
  }
}

// Simple logout that only clears local state (fallback option)
export async function logoutLocal() {
  if (!browser) return;

  try {
    error.set(null);

    // Clear local state
    user.set({});
    isAuthenticated.set(false);

    // Clear any Auth0 session data from localStorage/sessionStorage
    localStorage.removeItem("auth0.session");
    sessionStorage.removeItem("auth0.session");

    // Force reload to clear any cached auth state
    window.location.href = "/";
  } catch (e) {
    console.error("Local logout failed:", e);
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

    // Check if we're returning from a redirect
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      await handleRedirectCallback();
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Check if user is already authenticated
    const authenticated = await client.isAuthenticated();

    if (authenticated) {
      const userProfile = await client.getUser();
      user.set(userProfile || {});
      isAuthenticated.set(true);
    }
  } catch (e) {
    console.error("Auth initialization failed:", e);
    error.set(
      e instanceof Error ? e.message : "Authentication initialization failed",
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
  logoutLocal,
  getAccessToken,
  initializeAuth,
};

export default auth;
