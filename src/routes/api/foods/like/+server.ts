import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { likeFood, unlikeFood } from "$lib/server/database";
import { user } from "$lib/auth";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// function getCookie(name: string, cookies: string | null) {
//     if (!cookies) return null;
//     const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
//     return match ? match[2] : null;
// }

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
};

// 2. GET Handler (Fixes 405 when checking session status)
export const GET: RequestHandler = async ({ request }) => {
    // const cookies = request.headers.get("cookie");
    // const token = getCookie("access_token", cookies);

    // You should add token validation logic here (e.g., check expiry/database)
    // const isAuthenticated = !!token;

    return json(
        // { isAuthenticated: isAuthenticated },
        {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        },
    );
};

export const POST: RequestHandler = async (event) => {
    // const cookies = event.request.headers.get("cookie");
    // const token = getCookie("access_token", cookies);

    // if (!token) {
    //     return new Response(
    //         JSON.stringify({
    //             message: "You must be logged in to like a food.",
    //         }),
    //         {
    //             status: 401,
    //             headers: {
    //                 ...corsHeaders,
    //                 "Content-Type": "application/json",
    //             },
    //         },
    //     );
    // }

    const formData = await event.request.formData();
    const foodId = formData.get("foodId");
    const userId = formData.get("userId");
    const action = formData.get("action");

    if (
        !foodId ||
        !userId ||
        typeof foodId !== "string" ||
        typeof userId !== "string"
    ) {
        return new Response(JSON.stringify({ message: "Invalid request" }), {
            status: 400,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        });
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
        fetch("https://ntfy.sh/mexicocina", {
            method: "POST", // PUT works too
            body: `Error: ${err}`,
        });
        return new Response(
            JSON.stringify({ message: "Failed to like food" }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }
};
