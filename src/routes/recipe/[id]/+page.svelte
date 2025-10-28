<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { isAuthenticated, user, getAccessToken } from "$lib/auth";

    let recipe = $state<Record<string, string>>({});
    let liked = $state(false);

    onMount(async () => {
        const id = page.params.id;
        if (!id) return;
        const response = await fetch(
            `https://aesthetic-sunflower-97a6e4.netlify.app/api/food/${id}`,
        );
        recipe = await response.json();
    });

    $effect(() => {
        const fetchLikes = async () => {
            if ($isAuthenticated && $user?.sub) {
                const likesResponse = await fetch(
                    `https://aesthetic-sunflower-97a6e4.netlify.app/api/likes/${$user.sub}`,
                );
                const data = await likesResponse.json();
                liked = data[page.params.id!];
            } else {
                liked = false;
            }
        };
        fetchLikes();
    });

    onMount(async () => {
        const id = page.params.id;
        if (!id) return;
        const response = await fetch(
            `https://aesthetic-sunflower-97a6e4.netlify.app/api/foods/${id}`,
        );
        recipe = await response.json();

        if ($isAuthenticated) {
            const token = await getAccessToken();
            const likesResponse = await fetch(
                "https://aesthetic-sunflower-97a6e4.netlify.app/api/likes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const likes = await likesResponse.json();
            liked = likes[id];
        }
    });

    async function handleLike(id: string) {
        if (!$isAuthenticated) {
            alert("Please log in to like this food");
            return;
        }

        const currentAction = liked ? "unlike" : "like";
        liked = !liked;

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
    }
</script>

<svelte:head>
    {#if recipe}
        <title>{recipe.title}</title>
    {/if}
</svelte:head>

{#if recipe}
    <div
        class="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 space-y-6"
    >
        <!-- Title -->
        <h1 class="text-3xl font-bold text-center">{recipe.title}</h1>
        <button
            class="btn {liked ? 'btn-secondary' : ''}"
            onclick={() => handleLike(recipe.id)}
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
        <!-- Badges -->
        <div class="flex gap-2 flex-wrap justify-center">
            <div class="badge badge-primary">{recipe.difficulty}</div>
            {#if recipe.portion}
                <div class="badge badge-secondary">{recipe.portion}</div>
            {/if}
            <div class="badge badge-accent">{recipe.time}</div>
        </div>

        <!-- Description -->
        <p class="text-center text-base leading-relaxed">
            {recipe.description}
        </p>

        <img
            src={recipe.image}
            alt={recipe.title}
            class="w-full max-w-md mx-auto"
        />

        <!-- Ingredients -->
        <div class="w-full bg-base-200 rounded-box p-4">
            <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul class="list-disc list-inside space-y-1">
                {#each recipe.ingredients as ingredient}
                    <li>{ingredient}</li>
                {/each}
            </ul>
        </div>

        <!-- Steps -->
        <div class="w-full bg-base-200 rounded-box p-4">
            <h2 class="text-2xl font-semibold mb-2">Steps</h2>
            <ol class="list-decimal list-inside space-y-3">
                {#each recipe.method as step}
                    {#each Object.entries(step) as [key, value]}
                        <li>
                            {value}
                        </li>
                    {/each}
                {/each}
            </ol>
        </div>
    </div>
{:else}
    <p>Loading...</p>
{/if}
