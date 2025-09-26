import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { fetchFoods } from "$lib/server/database";

export const GET: RequestHandler = async (event) => {
  const foods = await fetchFoods();
  return json(foods);
};
