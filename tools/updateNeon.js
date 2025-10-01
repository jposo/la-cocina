import { neon } from "@netlify/neon";

const sql = neon(process.env.VITE_NEON_DATABASE_URL);

const response = await fetch("https://the-mexican-food-db.p.rapidapi.com", {
  headers: {
    "X-rapidapi-key": process.env.RAPIDAPI_KEY,
    "X-rapidapi-host": "the-mexican-food-db.p.rapidapi.com",
  },
});

const data = await response.json();

await sql`
 CREATE TABLE IF NOT EXISTS foods (
   id TEXT PRIMARY KEY,
   title TEXT NOT NULL,
   difficulty TEXT NOT NULL,
   image TEXT NOT NULL
 );
`;

for (const food of data) {
  await sql`
    INSERT INTO foods (id, title, difficulty, image)
    VALUES (${food.id}, ${food.title}, ${food.difficulty}, ${food.image})
    ON CONFLICT (id) DO NOTHING;
  `;
}
