# Auth0 Setup Instructions for La Mexicocina

This guide will help you set up Auth0 authentication for your SvelteKit application.

## Prerequisites

- Auth0 account (sign up at https://auth0.com if you don't have one)
- Your SvelteKit application running locally

## Step 1: Create an Auth0 Application

1. Log into your Auth0 Dashboard
2. Go to **Applications** in the sidebar
3. Click **Create Application**
4. Choose a name for your application (e.g., "La Mexicocina")
5. Select **Single Page Web Applications**
6. Click **Create**

## Step 2: Configure Your Auth0 Application

After creating your application, you'll be taken to the **Settings** tab:

### Basic Information
- Copy your **Domain** and **Client ID** - you'll need these for your environment variables

### Application URLs
Configure the following URLs (replace `http://localhost:5173` with your actual development URL):

- **Allowed Callback URLs**: 
  ```
  http://localhost:5173/callback, http://localhost:5173
  ```

- **Allowed Logout URLs**: 
  ```
  http://localhost:5173
  ```

- **Allowed Web Origins**: 
  ```
  http://localhost:5173
  ```

- **Allowed Origins (CORS)**: 
  ```
  http://localhost:5173
  ```

### For Production
When you deploy your app, add your production URLs to all the fields above:
```
https://your-domain.com/callback, https://your-domain.com
```

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Auth0 credentials in the `.env` file:
   ```env
   PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
   PUBLIC_AUTH0_CLIENT_ID=your-client-id-from-auth0-dashboard
   PUBLIC_AUTH0_AUDIENCE=
   ```

   > **Note**: The `PUBLIC_AUTH0_AUDIENCE` is optional unless you have an Auth0 API set up.
   > **Important**: Use `PUBLIC_` prefix for client-side variables in SvelteKit!

## Step 4: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Click the **Login** button in the navbar

4. You should be redirected to Auth0's login page

5. After successful login, you should be redirected back to your app and see your user information

## Step 5: Optional - Set Up an Auth0 API (for backend authentication)

If you plan to make authenticated API calls to a backend:

1. In your Auth0 Dashboard, go to **APIs**
2. Click **Create API**
3. Give it a name and identifier (e.g., `https://la-mexicocina-api`)
4. Add the API identifier to your `.env` file as `PUBLIC_AUTH0_AUDIENCE`

## Features Included

The Auth0 integration includes:

- **Login with Popup**: Quick login without leaving your app
- **Login with Redirect**: Traditional redirect-based login
- **Logout**: Proper logout from Auth0
- **Profile Page**: View user information at `/profile`
- **Route Protection**: Example of protecting routes
- **Access Tokens**: For making authenticated API calls
- **Error Handling**: User-friendly error messages
- **Loading States**: Loading indicators during auth operations

## Usage Examples

### In Your Components

```svelte
<script>
  import { isAuthenticated, user, loginWithPopup, logout } from '$lib/auth';
</script>

{#if $isAuthenticated}
  <p>Welcome, {$user.name}!</p>
  <button on:click={logout}>Logout</button>
{:else}
  <button on:click={loginWithPopup}>Login</button>
{/if}
```

### Making Authenticated API Calls

```javascript
import { getAccessToken } from '$lib/auth';

async function makeAPICall() {
  const token = await getAccessToken();
  
  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
}
```

### Protecting Routes

```svelte
<!-- In a protected page component -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated, isLoading } from '$lib/auth';

  onMount(() => {
    // Redirect if not authenticated
    if (!$isLoading && !$isAuthenticated) {
      goto('/');
    }
  });
</script>

{#if $isAuthenticated}
  <!-- Your protected content here -->
{/if}
```

## Troubleshooting

### Common Issues

1. **Callback URL mismatch**: Make sure your callback URLs in Auth0 match exactly with your application URLs

2. **CORS errors**: Ensure your domain is added to "Allowed Origins (CORS)" in your Auth0 application settings

3. **Environment variables not loading**: Make sure your `.env` file is in the root directory and client-side variables start with `PUBLIC_`

4. **Redirect loop**: Check that your callback route is properly configured and not causing infinite redirects

### Debug Mode

You can enable debug logging by adding this to your `.env` file:
```env
PUBLIC_DEBUG=true
```

## Security Best Practices

1. **Never expose sensitive data**: Auth0 client credentials for SPAs are public (hence `PUBLIC_` prefix), but never expose API secrets or client secrets
2. **Use HTTPS in production**: Always use HTTPS for production applications
3. **Validate tokens on the backend**: If you have an API, always validate tokens server-side
4. **Keep dependencies updated**: Regularly update Auth0 SDK and other security-related packages

## Production Deployment

When deploying to production:

1. Update your Auth0 application settings with your production URLs
2. Set your environment variables in your hosting platform (remember to use `PUBLIC_` prefix for client-side vars)
3. Ensure your build process includes the environment variables
4. Test the authentication flow in your production environment

### Netlify Environment Variables
In your Netlify dashboard, add these environment variables:
- `PUBLIC_AUTH0_DOMAIN`
- `PUBLIC_AUTH0_CLIENT_ID` 
- `PUBLIC_AUTH0_AUDIENCE` (if using APIs)

## Support

- [Auth0 Documentation](https://auth0.com/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Auth0 Community](https://community.auth0.com/)