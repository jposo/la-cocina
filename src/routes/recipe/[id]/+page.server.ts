import { fail } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { fetchFoodRecipe, getLikedFoods } from "$lib/server/database";

export const load: PageLoad = async ({ params, locals }) => {
  const id = params.id;
  const recipe = await fetchFoodRecipe(id);
  const user = locals.user;
  let likes = {};
  let userId = null;
  if (user) {
    userId = user.sub;
    likes = await getLikedFoods(userId);
  }
  if (!recipe) {
    return fail(404, { message: "Recipe not found" });
  }
  return { recipe, likes, id };
};
