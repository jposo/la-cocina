import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { fetchFoodRecipe, fetchFoods } from "$lib/server/database";

export const GET: RequestHandler = async (event) => {
    const id = event.params.id;
    if (!id) {
        error(404, { message: "Food not found" });
    }
    const recipe = await fetchFoodRecipe(id);
    return json(recipe, {
        headers: {
            "Access-Control-Allow-Origin": "*", // Allows requests from any domain
            "Access-Control-Allow-Methods": "GET", // Only necessary if you also have POST/PUT/DELETE
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
};
