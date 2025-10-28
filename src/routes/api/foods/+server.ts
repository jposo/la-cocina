import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { fetchFoods } from "$lib/server/database";

export const GET: RequestHandler = async (event) => {
    const foods = await fetchFoods();
    return json(foods, {
        headers: {
            "Access-Control-Allow-Origin": "*", // Allows requests from any domain
            "Access-Control-Allow-Methods": "GET", // Only necessary if you also have POST/PUT/DELETE
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
};
