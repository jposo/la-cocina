import { neon } from "@netlify/neon";

const sql = neon();

await sql`
 CREATE TABLE IF NOT EXISTS user_likes (
   user_id TEXT NOT NULL,
   food_id TEXT NOT NULL,
   PRIMARY KEY (user_id, food_id)
 );
`;
