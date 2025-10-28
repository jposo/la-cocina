<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import { onMount } from "svelte";
    import {
        initializeAuth,
        loginWithPopup,
        logout,
        logoutLocal,
        isAuthenticated,
        user,
        isLoading,
        error,
    } from "$lib/auth";

    export const prerender = true;

    let { children } = $props();

    onMount(() => {
        initializeAuth();
    });

    async function handleLogin() {
        try {
            await loginWithPopup();
        } catch (e) {
            console.error("Login failed:", e);
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch (e) {
            console.error("Auth0 logout failed, trying local logout:", e);
            // Fallback to local logout if Auth0 logout fails
            await logoutLocal();
        }
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>La Mexicocina</title>
</svelte:head>

<div class="navbar bg-base-300 shadow-sm fixed top-0 z-10">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">La Mexicocina</a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            {#if $isLoading}
                <li>
                    <span class="loading loading-spinner loading-sm"></span>
                </li>
            {:else if $isAuthenticated}
                <li class="dropdown dropdown-end">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-ghost btn-circle avatar"
                    >
                        <div class="w-10 rounded-full">
                            {#if $user?.picture}
                                <img src={$user.picture} alt="User avatar" />
                            {:else}
                                <div
                                    class="bg-neutral text-neutral-content w-full h-full flex items-center justify-center"
                                >
                                    {$user?.name?.charAt(0) || "U"}
                                </div>
                            {/if}
                        </div>
                    </div>
                    <ul
                        tabindex="-1"
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <span class="font-bold"
                                >{$user?.name || "User"}</span
                            >
                        </li>
                        <li>
                            <span class="text-sm opacity-70"
                                >{$user?.email || ""}</span
                            >
                        </li>
                        <li><a href="/profile">Profile</a></li>
                        <li><button onclick={handleLogout}>Logout</button></li>
                    </ul>
                </li>
            {:else}
                <li>
                    <button class="btn btn-primary" onclick={handleLogin}
                        >Login</button
                    >
                </li>
            {/if}
        </ul>
    </div>
</div>
{#if $error}
    <div class="alert alert-error mb-4">
        <span>{$error}</span>
        <button class="btn btn-sm" onclick={() => error.set(null)}>×</button>
    </div>
{/if}

<main class="mt-24">
    {@render children?.()}
</main>
