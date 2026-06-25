import { useAuthDetails } from "./use-auth-details";

export const useHasRole = (roleName: string) => {
  const auth = useAuthDetails();
  return auth?.role?.name === roleName;
};
