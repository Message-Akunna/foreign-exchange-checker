# Authentication Module Documentation

This directory (`src/auth`) contains the core authentication logic for the application. It manages user sessions, token storage, role-based access control (RBAC), and provides hooks for components to interact with the auth state.

## Core Architecture

The authentication system is built on a vanilla JavaScript store (`auth-store.ts`) wrapped in a React Context (`auth-context.tsx`). This decoupling allows the auth logic to be tested independently of React and ensures consistent state management across the application.

-   **Store (`auth-store.ts`)**: Manages the `AuthState` (tokens, user, role). Handles persistence to `localStorage` or `sessionStorage` based on user preference (`rememberMe`). It also synchronizes state across multiple tabs using the `storage` event.
-   **Context (`auth-context.tsx`)**: Exposes the store to the React component tree via `AuthProvider`. It also configures Axios interceptors to inject the access token into requests and handle 401 modifications.

## Types (`src/auth/_types/index.ts`)

### `AuthState`
The shape of the authentication state in the store.
```typescript
type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  auth: {
    user: User;
    role: Role;
    hasPinEnabled: boolean;
  } | null;
  rememberMe?: boolean;
};
```

### `Session`
Payload used when signing in.
```typescript
type Session = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  auth: AuthState['auth'];
  rememberMe?: boolean;
  storage?: 'local' | 'session';
};
```

---

## Components

### `<AuthProvider />`
Must wrap your application root to provide authentication state to all components.

```tsx
// src/app.tsx
import AuthProvider from '@/auth/auth-context';

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
```

### `<RoleProtectedRoute />`
A wrapper component for routes that requires a specific role. Redirects unauthenticated users to Login and unauthorized users to Forbidden.

```tsx
// src/routes.tsx
import { RoleProtectedRoute } from '@/auth/role-protected-route';

<Route
  path="/admin"
  element={
    <RoleProtectedRoute role="admin">
      <AdminDashboard />
    </RoleProtectedRoute>
  }
/>
```

---

## Hooks

All hooks are located in `src/auth/_hooks/` and should be imported from there or via the main exports.

### `useAuthManager`
The primary hook for managing authentication state. It combines multiple internal hooks to provide a comprehensive interface.

**Returns:**
-   `setSession(session: Session)`: Signs the user in.
-   `clearSession()`: Signs the user out.
-   `isAuthenticated`: Boolean indicating if valid credentials exist.
-   `auth`: The current user's details (`user`, `role`, `hasPinEnabled`).
-   `user`: Shortcut to `auth.user`.
-   `refreshToken`: The current refresh token.

**Usage:**
```tsx
const { setSession, clearSession, user } = useAuthManager();
```

### `useSignIn`
Returns a function to sign in the user. Used internally by `useAuthManager`.
```tsx
const signIn = useSignIn();
signIn({ accessToken: '...', ... });
```

### `useSignOut`
Returns a function to sign out the user. Clears storage and resets state.
```tsx
const signOut = useSignOut();
// <button onClick={signOut}>Logout</button>
```

### `useIsAuthenticated`
Returns `true` if the user is logged in (has valid access token and not expired).
```tsx
const isAuth = useIsAuthenticated();
```

### `useAuthDetails`
Returns the `auth` object from the store (User, Role, etc.).
```tsx
const { user, role } = useAuthDetails();
```

### `useAuthCompany`
Returns the company associated with the current user.
```tsx
const company = useAuthCompany();
console.log(company.name);
```

### `useHasRole`
Checks if the current user has a specific role.
```tsx
const isAdmin = useHasRole('admin');
```

### `useHasPermission`
Checks if the current user has access.
-   **Single permission**: `useHasPermission('org-view')`.
-   **Multiple (ALL)**: `useHasPermission(['org-view', 'org-edit'])` (default).
-   **Multiple (ANY)**: `useHasPermission(['org-view', 'org-edit'], true)`.
-   **Wildcards**: Supports wildcards (e.g., `org-*` matches `org-view`).

```tsx
const canEdit = useHasPermission('org-edit');
const canViewOrEdit = useHasPermission(['org-view', 'org-edit'], true);
```

### `useIdleLogout`
Automatically logs out the user after a period of inactivity.
-   **Default**: 15 minutes.
-   **Events**: Mouse move, keydown, click, touch.
-   **Usage**: Automatically invoked in `useAuthManager`.

### `useSilentRefresh`
Automatically refreshes the access token in the background before it expires.
-   **Interval**: Checks every 15 seconds.
-   **Threshold**: Refreshes if expiring in < 1 minute.
-   **Usage**: Automatically invoked in `useAuthManager`.

---

## Example Scenarios

### 1. Login Logic
```tsx
import { useAuthManager } from '@/auth/use-auth-manager';
import { useMutation } from '@tanstack/react-query';

const Login = () => {
  const { setSession } = useAuthManager();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        auth: data.user, // Ensure this matches AuthState['auth'] structure
        rememberMe: true,
      });
    },
  });

  // ... form
};
```

### 2. Access Control in Component
```tsx
import { useHasPermission } from '@/auth/_hooks/use-has-permission';

const EditButton = () => {
  const canEdit = useHasPermission('resource-edit');

  if (!canEdit) return null;

  return <button>Edit</button>;
};
```

### 3. Protecting a Route
Use `RoleProtectedRoute` in your router configuration.
```tsx
import { RoleProtectedRoute } from '@/auth/role-protected-route';

// ...
<Route
  element={
    <RoleProtectedRoute role="manager">
      <ManagerPage />
    </RoleProtectedRoute>
  }
/>
```
