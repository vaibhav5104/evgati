import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [notifications, setNotifications] = useState(0); 

  const API = import.meta.env.VITE_API_URL;
  const F_API = import.meta.env.VITE_FRONTEND_API_URL;
  const FASTAPI = import.meta.env.VITE_FASTAPI_SCRAPING_URL
  const authorizationToken = token ? `Bearer ${token}` : "";

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setToken(null);
    setUser(null);
    setNotifications(0); // ✅ clear notifications on logout
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.userData;
        setUser(userData);
        setIsAuthenticated(true);

        // ✅ Update notifications
        if (userData?.friendRequests?.length > 0) {
          setNotifications(userData.friendRequests.length);
        } else {
          setNotifications(0);
        }

      } else {
        setUser(null);
        setNotifications(0); // fallback
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      setUser(null);
      setNotifications(0); // fallback
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        storeTokenInLS,
        LogoutUser,
        user,
        setUser,
        notifications, // ✅ exported
        setNotifications, // ✅ exported
        authorizationToken,
        isLoading,
        API,
        F_API,
        FASTAPI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};

export { AuthContext, AuthProvider, useAuth };
