import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { likeFood, unlikeFood } from "$lib/server/database";

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
                    "Access-Control-Allow-Origin": "*", // Allows requests from any domain
                    "Access-Control-Allow-Methods": "GET", // Only necessary if you also have POST/PUT/DELETE
                    "Access-Control-Allow-Headers": "Content-Type",
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
