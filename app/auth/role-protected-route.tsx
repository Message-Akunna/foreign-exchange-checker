// auth/role-protected-route.tsx
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "./_hooks/use-is-authenticated";
import { useHasRole } from "./_hooks/use-has-role";
import { AUTH_KEYS as ROUTE_AUTH_KEYS, PUBLIC_KEYS } from "@/routes/keys";

export const RoleProtectedRoute = ({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) => {
  const isAuth = useIsAuthenticated();
  const hasRole = useHasRole(role);

  if (!isAuth) return <Navigate to={ROUTE_AUTH_KEYS.LOGIN.PATH} replace />;
  if (!hasRole) return <Navigate to={PUBLIC_KEYS.FORBIDDEN.PATH} replace />;

  return children;
};
