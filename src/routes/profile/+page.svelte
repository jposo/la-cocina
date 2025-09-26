<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isAuthenticated, user, isLoading, getAccessToken } from "$lib/auth";

  let accessToken: string | null = null;

  onMount(async () => {
    // Redirect to home if not authenticated
    if (!$isAuthenticated) {
      goto("/");
      return;
    }

    // Get access token for API calls
    try {
      accessToken = await getAccessToken();
    } catch (e) {
      console.error("Failed to get access token:", e);
    }
  });

  // Reactive statement to redirect if user logs out
  $: if (!$isLoading && !$isAuthenticated) {
    goto("/");
  }
</script>

<svelte:head>
  <title>Profile - La Mexicocina</title>
</svelte:head>

{#if $isLoading}
  <div class="flex justify-center items-center min-h-[50vh]">
    <div class="loading loading-spinner loading-lg"></div>
  </div>
{:else if $isAuthenticated && $user}
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">User Profile</h1>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex items-center space-x-4">
            <div class="avatar">
              <div class="w-20 h-20 rounded-full">
                {#if $user.picture}
                  <img
                    src={$user.picture}
                    alt="Profile picture of {$user.name}"
                  />
                {:else}
                  <div
                    class="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-2xl font-bold"
                  >
                    {$user.name?.charAt(0) || "U"}
                  </div>
                {/if}
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-semibold">{$user.name || "User"}</h2>
              <p class="text-base-content/70">{$user.email || ""}</p>
            </div>
          </div>

          <div class="divider"></div>

          <div class="space-y-4">
            <h3 class="text-xl font-semibold mb-4">Profile Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="input">
                <span class="label">Name</span>
                <input type="text" value={$user.name || ""} readonly />
              </label>

              <label class="input">
                <span class="label">Email</span>
                <input type="email" value={$user.email || ""} readonly />
              </label>

              <label class="input">
                <span class="label">Nickname</span>
                <input type="text" value={$user.nickname || ""} readonly />
              </label>

              <label class="input">
                <span class="label">Email Verified</span>
                <span
                  class="badge {$user.email_verified
                    ? 'badge-success'
                    : 'badge-warning'}"
                >
                  {$user.email_verified ? "Verified" : "Not Verified"}
                </span>
                <input class="hidden" />
              </label>

              {#if $user.updated_at}
                <label class="input">
                  <span class="label">Last Updated</span>
                  <input
                    type="text"
                    value={new Date($user.updated_at).toLocaleDateString()}
                    readonly
                  />
                </label>
              {/if}

              {#if $user.locale}
                <label class="input">
                  <span class="label">Locale</span>
                  <input type="text" value={$user.locale} readonly />
                </label>
              {/if}
            </div>
          </div>

          {#if accessToken}
            <div class="divider"></div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">Developer Info</h3>
              <label class="input w-full">
                <span class="label">Access Token (First 50 chars)</span>
                <input
                  type="text"
                  value={accessToken.substring(0, 50) + "..."}
                  readonly
                />
              </label>
            </div>
          {/if}

          <div class="card-actions justify-end mt-6">
            <button class="btn btn-primary" onclick={() => goto("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <!-- Raw user object for debugging -->
      <details class="mt-8">
        <summary class="cursor-pointer text-sm opacity-70 hover:opacity-100">
          View Raw User Object (Debug)
        </summary>
        <div class="mt-4">
          <pre
            class="bg-base-200 p-4 rounded-lg text-xs overflow-auto">{JSON.stringify(
              $user,
              null,
              2,
            )}</pre>
        </div>
      </details>
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center min-h-[50vh]">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">Access Denied</h2>
      <p class="mb-4">You need to be logged in to view this page.</p>
      <button class="btn btn-primary" onclick={() => goto("/")}>
        Go Home
      </button>
    </div>
  </div>
{/if}
