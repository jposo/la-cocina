import type { Handle } from "@sveltejs/kit";
import { config } from "$lib/auth_config";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("access_token");

  if (token) {
    try {
      const response = await fetch(`https://${config.domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        event.locals.user = user;
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  return resolve(event);
};
