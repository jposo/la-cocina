<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { isAuthenticated, user, getAccessToken } from "$lib/auth";

    let foods = $state<Record<string, string>[]>([]);
    let likes = $state<Record<string, boolean>>({});

    onMount(async () => {
        const response = await fetch(
            "https://aesthetic-sunflower-97a6e4.netlify.app/api/foods",
        );
        foods = await response.json();
    });

    $effect(() => {
        const fetchLikes = async () => {
            if ($isAuthenticated && $user?.sub) {
                const likesResponse = await fetch(
                    `https://aesthetic-sunflower-97a6e4.netlify.app/api/likes/${$user.sub}`,
                );
                likes = await likesResponse.json();
            } else {
                likes = {};
            }
        };
        fetchLikes();
    });

    async function handleLike(id: string) {
        if (!$isAuthenticated) {
            alert("Please log in to like this food");
            return;
        }

        const currentAction = likes[id] ? "unlike" : "like";
        likes[id] = !likes[id];

        try {
            await fetch(
                `https://aesthetic-sunflower-97a6e4.netlify.app/api/foods/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        foodId: id,
                        userId: $user.sub,
                        action: currentAction,
                    }),
                },
            );
        } catch (error) {
            console.error(error);
            alert(`Failed to like/unlike food: ${error}`);
        }
    }
</script>

<div class="flex flex-wrap justify-center gap-4">
    {#each foods as food}
        {@const liked = likes[food.id]}
        <div class="card bg-base-200 w-96 shadow-sm">
            <figure>
                <img
                    class="h-48 w-full object-cover"
                    src={food.image}
                    alt="Food"
                />
            </figure>
            <div class="card-body">
                <h2 class="card-title">{food.title}</h2>
                <p>{food.difficulty}</p>
                <div class="card-actions justify-end">
                    <button
                        class="btn {liked ? 'btn-secondary' : ''}"
                        onclick={() => handleLike(food.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={liked ? "white" : ""}
                            viewBox="0 0 24 24"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="size-[1.2em]"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            /></svg
                        >
                        {liked ? "Unlike" : "Like"}
                    </button>
                    <button
                        class="btn btn-primary"
                        onclick={() => goto(`/recipe/${food.id}`)}
                        >View Recipe</button
                    >
                </div>
            </div>
        </div>
    {/each}
</div>
