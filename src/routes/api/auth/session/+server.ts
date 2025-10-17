import type { RequestHandler } from '@sveltejs/kit';

// Set the access token as a secure, httpOnly cookie
export const POST: RequestHandler = async ({ request }) => {
  const { token } = await request.json();

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': `access_token=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`,
    },
  });
};

// Clear the session cookie on logout
export const DELETE: RequestHandler = async () => {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': `access_token=; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};
