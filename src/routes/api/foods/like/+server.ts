import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { likeFood, unlikeFood } from "$lib/server/database";

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
};

export const GET: RequestHandler = async (event) => {
    const url = new URL(event.request.url);
    const foodId = url.searchParams.get("foodId");
    const userId = url.searchParams.get("userId");
    const action = url.searchParams.get("action");

    if (!foodId || !userId) {
        return json(
            { message: "Invalid request" },
            {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        );
    }

    try {
        if (action === "like") await likeFood(userId, foodId);
        else if (action === "unlike") await unlikeFood(userId, foodId);

        return json(
            { success: true },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        );
    } catch (err) {
        console.error(err);
        return json(
            { message: "Failed to like/unlike food" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        );
    }
};
