<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  console.log(data.recipe);
</script>

<div
  class="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 space-y-6"
>
  <!-- Title -->
  <h1 class="text-3xl font-bold text-center">{data.recipe.title}</h1>

  <!-- Badges -->
  <div class="flex gap-2 flex-wrap justify-center">
    <div class="badge badge-primary">{data.recipe.difficulty}</div>
    {#if data.recipe.portion}
      <div class="badge badge-secondary">{data.recipe.portion}</div>
    {/if}
    <div class="badge badge-accent">{data.recipe.time}</div>
  </div>

  <!-- Description -->
  <p class="text-center text-base leading-relaxed">{data.recipe.description}</p>

  <img
    src={data.recipe.image}
    alt={data.recipe.title}
    class="w-full max-w-md mx-auto"
  />

  <!-- Ingredients -->
  <div class="w-full bg-base-200 rounded-box p-4">
    <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
    <ul class="list-disc list-inside space-y-1">
      {#each data.recipe.ingredients as ingredient}
        <li>{ingredient}</li>
      {/each}
    </ul>
  </div>

  <!-- Steps -->
  <div class="w-full bg-base-200 rounded-box p-4">
    <h2 class="text-2xl font-semibold mb-2">Steps</h2>
    <ol class="list-decimal list-inside space-y-3">
      {#each data.recipe.method as step}
        {#each Object.entries(step) as [key, value]}
          <li>
            {value}
          </li>
        {/each}
      {/each}
    </ol>
  </div>
</div>
