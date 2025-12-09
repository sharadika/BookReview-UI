import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";

const InitializeAuth = () => {
  const { instance } = useMsal();

  useEffect(() => {
    const accounts = instance.getAllAccounts();

    if (accounts && accounts.length > 0) {
      instance.setActiveAccount(accounts[0]); // Restore session
    }
  }, []);

  return null;
};

export default InitializeAuth;
