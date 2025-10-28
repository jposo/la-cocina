import { json, type RequestHandler, error } from "@sveltejs/kit";

// Set the access token as a secure, httpOnly cookie
export const POST: RequestHandler = async ({ request }) => {
    const { token } = await request.json();

    if (!token) {
        return error(400, { message: "Token is required" });
    }

    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Set-Cookie": `access_token=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`,
            },
        },
    );
};

// Clear the session cookie on logout
export const DELETE: RequestHandler = async () => {
    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Set-Cookie": `access_token=; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            },
        },
    );
};
