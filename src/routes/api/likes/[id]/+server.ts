import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { getLikedFoods } from "$lib/server/database";

export const GET: RequestHandler = async (event) => {
    const id = event.params.id;
    if (!id) {
        error(404, { message: "Provide a valid User ID" });
    }
    const likes = await getLikedFoods(id);
    return json(likes);
};
