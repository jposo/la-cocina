import { neon } from "@netlify/neon";
import { NETLIFY_DATABASE_URL } from "$env/static/private";

export const fetchFoods = async () => {
  const sql = neon(NETLIFY_DATABASE_URL);
  const foods = await sql`SELECT * FROM foods`;
  return foods as {
    id: string;
    title: string;
    difficulty: string;
    image: string;
  }[];
};

export const fetchFoodRecipe = async (id: string) => {
  const sql = neon(NETLIFY_DATABASE_URL);
  const [recipe] = await sql`
    SELECT foods.*, recipes.portion, recipes.time, recipes.description, recipes.ingredients, recipes.method
    FROM recipes
    JOIN foods ON foods.id = recipes.food_id
    WHERE recipes.id = ${id}
  `;
  return recipe as {
    id: string;
    title: string;
    difficulty: string;
    portion: string;
    time: string;
    description: string;
    ingredients: string[];
    method: Record<string, string>[];
    image: string;
  }[];
};
