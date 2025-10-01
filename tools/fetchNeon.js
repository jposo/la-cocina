import { neon } from "@netlify/neon";

const sql = neon(process.env.VITE_NEON_DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  food_id TEXT REFERENCES foods(id),
  portion TEXT,
  time TEXT,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  method JSONB NOT NULL
  );
`;

const foods = await sql`SELECT * FROM foods`;

// falta 18
for (let i = 18; i < 19; i++) {
  const food = foods[i];
  const response = await fetch(
    `https://the-mexican-food-db.p.rapidapi.com/${food.id}`,
    {
      headers: {
        "X-rapidapi-key": process.env.RAPIDAPI_KEY,
        "X-rapidapi-host": "the-mexican-food-db.p.rapidapi.com",
      },
    },
  );
  const recipe = await response.json();
  console.log(recipe);
  await sql`
    INSERT INTO recipes (id, food_id, time, description, ingredients, method)
    VALUES (${recipe.id}, ${food.id}, ${recipe.time}, ${recipe.description}, ${recipe.ingredients}, ${JSON.stringify(recipe.method)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET food_id = EXCLUDED.food_id, portion = EXCLUDED.portion, time = EXCLUDED.time, description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, method = EXCLUDED.method
  `;
}
