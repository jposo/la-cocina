import { neon } from "@netlify/neon";
import { RAPIDAPI_KEY, NETLIFY_DATABASE_URL } from "$env/static/private";

export const fetchFoods = async () => {
    const response = await fetch(
        `https://the-mexican-food-db.p.rapidapi.com/`,
        {
            headers: {
                "X-rapidapi-key": RAPIDAPI_KEY,
                "X-rapidapi-host": "the-mexican-food-db.p.rapidapi.com",
            },
        },
    );
    const data = await response.json();
    return data as {
        id: string;
        title: string;
        difficulty: string;
        image: string;
    }[];
};

export const fetchFoodRecipe = async (id: string) => {
    const response = await fetch(
        `https://the-mexican-food-db.p.rapidapi.com/${id}`,
        {
            headers: {
                "X-rapidapi-key": RAPIDAPI_KEY,
                "X-rapidapi-host": "the-mexican-food-db.p.rapidapi.com",
            },
        },
    );
    const data = await response.json();
    return data as {
        id: string;
        title: string;
        difficulty: string;
        portion: string;
        time: string;
        description: string;
        ingredients: string[];
        method: Record<string, string>[];
        image: string;
    };
};

export const getLikedFoods = async (userId: string) => {
    const sql = neon(NETLIFY_DATABASE_URL);
    const rows: { food_id: string }[] =
        await sql`SELECT food_id FROM user_likes WHERE user_id = ${userId}`;
    const likes: Record<string, boolean> = {};
    rows.forEach((row) => {
        likes[row.food_id] = true;
    });
    return likes;
};

export const likeFood = async (userId: string, foodId: string) => {
    const sql = neon(NETLIFY_DATABASE_URL);
    await sql`
    INSERT INTO user_likes (user_id, food_id) VALUES (${userId}, ${foodId})
  `;
};

export const unlikeFood = async (userId: string, foodId: string) => {
    const sql = neon(NETLIFY_DATABASE_URL);
    await sql`
    DELETE FROM user_likes WHERE user_id = ${userId} AND food_id = ${foodId}
  `;
};
