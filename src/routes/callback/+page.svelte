<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { handleRedirectCallback, isLoading, error } from "$lib/auth";

  onMount(async () => {
    // Check if we have auth callback parameters
    const urlParams = page.url.searchParams;
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      console.error("Auth0 callback error:", errorParam);
      error.set(`Authentication failed: ${errorParam}`);
      goto("/");
      return;
    }

    if (code && state) {
      try {
        await handleRedirectCallback();
        // Redirect to home page after successful authentication
        goto("/");
      } catch (e) {
        console.error("Failed to handle redirect callback:", e);
        goto("/");
      }
    } else {
      // No auth parameters, redirect to home
      goto("/");
    }
  });
</script>

<div class="flex justify-center items-center min-h-screen">
  {#if $isLoading}
    <div class="text-center">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4">Processing authentication...</p>
    </div>
  {:else if $error}
    <div class="text-center">
      <div class="alert alert-error">
        <p>{$error}</p>
      </div>
      <button class="btn btn-primary mt-4" onclick={() => goto("/")}>
        Go Home
      </button>
    </div>
  {:else}
    <div class="text-center">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4">Redirecting...</p>
    </div>
  {/if}
</div>
