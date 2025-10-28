import { json, type RequestHandler, error } from "@sveltejs/kit";

// Define the standard CORS headers once
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true", // Needed when using HttpOnly cookies
};

// Helper function to extract a cookie (adjust based on your actual needs)
function getCookie(name: string, cookies: string | null) {
    if (!cookies) return null;
    const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}

// 1. OPTIONS Handler (Fixes Preflight CORS Error)
export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
};

// 2. GET Handler (Fixes 405 when checking session status)
export const GET: RequestHandler = async ({ request }) => {
    const cookies = request.headers.get("cookie");
    const token = getCookie("access_token", cookies);

    // You should add token validation logic here (e.g., check expiry/database)
    const isAuthenticated = !!token;

    return json(
        { isAuthenticated: isAuthenticated },
        {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        },
    );
};

// 3. POST Handler (Login)
export const POST: RequestHandler = async ({ request }) => {
    const { token } = await request.json();

    if (!token) {
        return error(400, { message: "Token is required" });
    }

    return json(
        { success: true },
        {
            headers: {
                ...corsHeaders,
                // Ensure cookies are set after the CORS headers
                "Set-Cookie": `access_token=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`,
            },
        },
    );
};

// 4. DELETE Handler (Logout)
export const DELETE: RequestHandler = async () => {
    return json(
        { success: true },
        {
            headers: {
                ...corsHeaders,
                "Set-Cookie": `access_token=; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            },
        },
    );
};
