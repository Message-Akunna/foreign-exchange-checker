import { useAuthDetails } from "./use-auth-details";

export const useAuthCompany = () => {
  const auth = useAuthDetails();
  return auth?.user.company;
};
