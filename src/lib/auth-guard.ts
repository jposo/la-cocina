import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { isAuthenticated, isLoading } from './auth';
import { browser } from '$app/environment';

/**
 * Route guard utility for protecting pages that require authentication
 * Use this in +page.server.ts or +layout.server.ts files
 */
export function requireAuth(url: URL) {
  // Only check authentication on the client side
  if (!browser) {
    return;
  }

  const authenticated = get(isAuthenticated);
  const loading = get(isLoading);

  // Don't redirect if still loading auth state
  if (loading) {
    return;
  }

  // Redirect to login if not authenticated
  if (!authenticated) {
    throw redirect(302, `/login?returnTo=${encodeURIComponent(url.pathname)}`);
  }
}

/**
 * Client-side route protection for Svelte components
 * Returns whether the user is authenticated and ready
 */
export function useAuthGuard(redirectTo = '/') {
  const authenticated = get(isAuthenticated);
  const loading = get(isLoading);

  if (!browser) {
    return { isReady: false, isAuthenticated: false };
  }

  // If not loading and not authenticated, redirect
  if (!loading && !authenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return { isReady: false, isAuthenticated: false };
  }

  return {
    isReady: !loading,
    isAuthenticated: authenticated
  };
}

/**
 * Higher-order component wrapper for protecting routes
 */
export function withAuthGuard<T extends Record<string, any>>(
  component: any,
  options: { redirectTo?: string; loadingComponent?: any } = {}
) {
  return (props: T) => {
    const { isReady, isAuthenticated } = useAuthGuard(options.redirectTo);

    if (!isReady) {
      return options.loadingComponent || null;
    }

    if (!isAuthenticated) {
      return null; // Will redirect via useAuthGuard
    }

    return component(props);
  };
}
