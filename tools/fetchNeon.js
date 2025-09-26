import { neon } from "@netlify/neon";

const sql = neon(
  "postgresql://neondb_owner:npg_X7DoIn8MdZvi@ep-divine-rice-ae0i339s-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
);

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
        "X-rapidapi-key": "44c12adecemsh320682a30f3dad7p1787ffjsnee0a55ba40ff",
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
