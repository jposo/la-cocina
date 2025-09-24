import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
  return json([{ id: "1", title: "Recipe 1", description: "Description 1" }]);
};
