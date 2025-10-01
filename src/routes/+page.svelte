<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-wrap justify-center gap-4">
  {#each data.foods as food}
    <div class="card bg-base-200 w-96 shadow-sm">
      <figure>
        <img class="h-48 w-full object-cover" src={food.image} alt="Food" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{food.title}</h2>
        <p>{food.difficulty}</p>
        <div class="card-actions justify-end">
          <button
            class="btn btn-primary"
            onclick={() => goto(`/recipe/${food.id}`)}>View Recipe</button
          >
        </div>
      </div>
    </div>
  {/each}
</div>
