import { neon } from "@netlify/neon";

const sql = neon(
  "postgresql://neondb_owner:npg_X7DoIn8MdZvi@ep-divine-rice-ae0i339s-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
);

const response = await fetch("https://the-mexican-food-db.p.rapidapi.com", {
  headers: {
    "X-rapidapi-key": "0761e47828msh41d735d157cffe2p10b18ajsn4e7bbf9be47b",
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
