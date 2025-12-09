import { useMsal } from "@azure/msal-react";

export const useAuthRoles = () => {
  const { accounts } = useMsal();
  const roles = accounts[0]?.idTokenClaims?.roles || [];

  return {
    roles,
    isAdmin: roles.includes("Admin"),
    isUser: roles.includes("User")
  };
};
