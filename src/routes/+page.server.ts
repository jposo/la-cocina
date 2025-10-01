import { fetchFoods } from "$lib/server/database";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
  const foods = await fetchFoods();
  return { foods };
};
