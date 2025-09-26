import { fail } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { fetchFoodRecipe } from "$lib/server/database";

export const load: PageLoad = async (event) => {
  const id = event.params.id;
  const recipe = await fetchFoodRecipe(id);
  if (!recipe) {
    return fail(404, { message: "Recipe not found" });
  }
  return { recipe };
};
