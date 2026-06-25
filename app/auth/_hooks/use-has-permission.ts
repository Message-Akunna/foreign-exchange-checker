import { useAuthDetails } from "./use-auth-details";
import { hasPermission } from "../permissions";

export const useHasPermission = (
  required: string | string[],
  partial = false
) => {
  const auth = useAuthDetails();
  const userPermissions = auth?.role?.permissions?.map((p) => p.name) ?? [];

  if (Array.isArray(required)) {
    if (partial) {
      return required.some((req) => hasPermission(userPermissions, req));
    }
    return required.every((req) => hasPermission(userPermissions, req));
  }

  return hasPermission(userPermissions, required);
};
