import {
  fetchFoods,
  likeFood,
  unlikeFood,
  getLikedFoods,
} from "$lib/server/database";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ locals }) => {
  const foods = await fetchFoods();
  const user = locals.user;
  let likes = {};
  let userId = null;
  if (user) {
    userId = user.sub;
    likes = await getLikedFoods(userId);
  }
  console.log(likes);
  return { foods, likes, userId };
};

export const actions = {
  async like({ request, locals }) {
    const user = locals.user;

    if (!user) {
      return { error: "You must be logged in to like a food." };
    }

    const userId = user.sub;

    const formData = await request.formData();
    const foodId = formData.get("foodId");
    const action = formData.get("action");

    if (!foodId || !userId || typeof foodId !== "string") {
      return { error: "Invalid request" };
    }

    try {
      if (action === "like") {
        await likeFood(userId, foodId);
      } else if (action === "unlike") {
        console.log("unliked");
        await unlikeFood(userId, foodId);
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: "Failed to like food" };
    }
  },
};
