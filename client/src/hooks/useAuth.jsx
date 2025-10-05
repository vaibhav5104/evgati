import { stationService } from "../services/stationService";
import { bookingService } from "../services/bookingService";
import { createContext, useContext, useEffect, useState } from "react";
import { availabilityService } from "../services/availabilityService";
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

    // New notification states for different roles and types
  const [userNotifications, setUserNotifications] = useState({
    userRequestsLength: 0,
    approvedRequestsLength: 0,
    rejectedRequestsLength: 0
  });

  const [ownerNotifications, setOwnerNotifications] = useState({
    total: 0
  });

  const [adminNotifications, setAdminNotifications] = useState({
    pendingStationRequestsLength: 0,
    pendingUserRequestsLength: 0,
    totalPendingActionsLength: 0
  });

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setToken(null);
    setUser(null);
    setNotifications(0); // ✅ clear notifications on logout
    setIsAuthenticated(false);
    // Reset all notification states
    setUserNotifications({
      approvedRequestsLength: 0,
      rejectedRequestsLength: 0
    });
    setOwnerNotifications({
      total : 0,
      pending : 0
    });
    setAdminNotifications({
      pendingStationRequestsLength: 0,
      pendingUserRequestsLength: 0,
      totalPendingActionsLength: 0
    });
    localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    // const x= stationService.getAllStations()
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

  // ---- Login with email/password ----
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      if (data.token) {
        storeTokenInLS(data.token);
        await userAuthentication(); // refresh user
      }

      return data;
    } catch (err) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  // ---- Login with Google ----
  const loginWithGoogle = async (googleCredential) => {
    try {
      const response = await fetch(`${API}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: googleCredential }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Google login failed");
      }

      const data = await response.json();
      if (data.token) {
        storeTokenInLS(data.token);
        await userAuthentication();
      }

      return data;
    } catch (err) {
      console.error("Google login error:", err.message);
      throw err;
    }
  };

  // Fetch notifications based on user role
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      switch (user.role) {
        case 'user':
          const requests = await bookingService.getUserBookings();
          const userNotificationState = {
            userRequestsLength: requests.length,
            approvedRequestsLength: requests.filter(req => req.status === 'accepted').length,
            rejectedRequestsLength: requests.filter(req => req.status === 'rejected').length,
            pendingRequestsLength: requests.filter(req => req.status === 'pending').length,
            // Add full request details for more context
            requests: requests
          };
          setUserNotifications(userNotificationState);
          break;

        case 'owner':
          const [pendingBookings, ownerDetails] = await Promise.all([
            Promise.all(
              user.ownedStations.map(async (stationId) => {
                const { station, pendingRequests } = await bookingService.getPendingRequests(stationId);
                return pendingRequests.map(req => ({
                  type: "booking",
                  ...req,
                  stationId: station,
                  stationName: station.name
                }));
              })
            ),
            fetch(`${API}/api/auth/user`, {
              method: "GET",
              headers: { Authorization: authorizationToken }
            }).then(res => res.json())
          ]);

          const flatPendingBookings = pendingBookings.flat();

          const pendingStationRequests = await Promise.all(
            ownerDetails.userData.stationRequests.map(async (stationId) => {
              const station = await stationService.getStationById(stationId);
              return {
                type: "station",
                stationId,
                stationName: station?.name || "Unknown Station",
                createdAt: station?.createdAt || new Date().toISOString()
              };
            })
          );

          const allPending = [
            ...pendingStationRequests,
            ...flatPendingBookings
          ];

          setOwnerNotifications({
            total: allPending.length,
            pending: allPending,
            // Add more granular tracking
            pendingBookingsCount: flatPendingBookings.length,
            pendingStationsCount: pendingStationRequests.length
          });
          break;

        case 'admin':
          // Existing admin notification logic remains the same
          break;
      }
    } catch (error) {
      console.error('Notification Fetch Error:', error);
      // Implement more robust error handling
      // Potentially show a toast or log to monitoring service
    }
  };


  useEffect(() => {
    userAuthentication();
  }, [token]);
  // Update notification fetching on user authentication
  useEffect(() => {
    if (isAuthenticated || user) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  // Poll every 30s for real-time updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Increased to 1 minute to reduce unnecessary API calls

    return () => clearInterval(interval);
  }, [user]);

  // Poll every 30s for real-time updates
  useEffect(() => {
    // if (!user) return;

    const interval = setInterval(() => {
      const stations = stationService.getAllStations()
      stations.map((station) => {
        const liveStations = availabilityService.getAvailability(station._id)
      })
    }, 60000); // Increased to 1 minute to reduce unnecessary API calls

    return () => clearInterval(interval);
  });


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        storeTokenInLS,
        LogoutUser,
        user,
        login,
        loginWithGoogle,
        setUser,
        notifications, // ✅ exported
        setNotifications, // ✅ exported
        authorizationToken,
        isLoading,
        API,
        F_API,
        FASTAPI,
        // Expose notification states
        userNotifications,
        ownerNotifications,
        adminNotifications,
        fetchNotifications,
        setAdminNotifications,
        setOwnerNotifications,
        setUserNotifications,
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