import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { likeFood, unlikeFood } from "$lib/server/database";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true", // Needed when using HttpOnly cookies
};

function getCookie(name: string, cookies: string | null) {
    if (!cookies) return null;
    const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}

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

export const POST: RequestHandler = async (event) => {
    const user = event.locals.user;

    if (!user) {
        return error(401, "You must be logged in to like a food.");
    }

    const userId = user.sub;

    const formData = await event.request.formData();
    const foodId = formData.get("foodId");
    const action = formData.get("action");

    if (!foodId || !userId || typeof foodId !== "string") {
        return error(400, "Invalid request");
    }

    try {
        if (action === "like") {
            await likeFood(userId, foodId);
        } else if (action === "unlike") {
            await unlikeFood(userId, foodId);
        }
        return json(
            { success: true },
            {
                headers: {
                    ...corsHeaders,
                },
            },
        );
    } catch (err) {
        console.error(err);
        return error(500, "Failed to like food");
    }

    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*", // Allows requests from any domain
                "Access-Control-Allow-Methods": "GET", // Only necessary if you also have POST/PUT/DELETE
                "Access-Control-Allow-Headers": "Content-Type",
            },
        },
    );
};
