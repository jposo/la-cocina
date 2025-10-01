import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  // Get the code and state from the callback URL
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (code && state) {
    // Redirect to home page with the auth parameters intact
    // The client-side auth will handle the actual token exchange
    return redirect(302, `/?code=${code}&state=${state}`);
  }

  // If no auth parameters, just redirect to home
  return redirect(302, "/");
};
