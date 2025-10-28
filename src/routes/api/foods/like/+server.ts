import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { likeFood, unlikeFood } from "$lib/server/database";

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*", // allow JSON, formdata, etc
        },
    });
};

export const POST: RequestHandler = async (event) => {
    // --- Step 1: Read raw body safely, even when Netlify pre-parsed it
    let bodyText = "";
    try {
        bodyText = await event.request.text();
    } catch {
        return json({ message: "No request body" }, { status: 400 });
    }

    // --- Step 2: Try to parse as JSON, fallback to FormData
    let foodId: string | null = null;
    let userId: string | null = null;
    let action: string | null = null;

    try {
        const parsed = JSON.parse(bodyText);
        foodId = parsed.foodId;
        userId = parsed.userId;
        action = parsed.action;
    } catch {
        try {
            const form = await event.request.formData();
            foodId = form.get("foodId") as string;
            userId = form.get("userId") as string;
            action = form.get("action") as string;
        } catch {
            // ignore
        }
    }

    if (!foodId || !userId) {
        return json(
            { message: "Invalid request" },
            {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods":
                        "GET, POST, DELETE, OPTIONS",
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
                    "Access-Control-Allow-Methods":
                        "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        );
    } catch (err) {
        console.error(err);
        return json(
            { message: "Failed to like food" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods":
                        "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        );
    }
};
