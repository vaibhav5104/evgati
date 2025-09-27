import { stationService } from "../services/stationService";
import { bookingService } from "../services/bookingService";

import React, { createContext, useContext, useEffect, useState } from "react";
import {authService} from "../services/authService"
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
          const requests = await bookingService.getUserBookings(); // returns array
          console.log(requests)
          setUserNotifications({
            approvedRequestsLength: requests.filter(req => req.status === 'accepted').length, // ✅ matches API field
            rejectedRequestsLength: requests.filter(req => req.status === 'rejected').length,
            pendingRequestsLength: requests.filter(req => req.status === 'pending').length
          });
          break;

          case 'owner':
            // 1. Get all pending booking requests for owner's stations
            const requestsArray = await Promise.all(
              user.ownedStations.map(async (stationId) => {
                const { station, pendingRequests } = await bookingService.getPendingRequests(stationId);
                return pendingRequests.map(req => ({
                  ...req,
                  stationId: station
                }));
              })
            );
            const pendingRequests = requestsArray.flat();
            // console.log(pendingRequests);            
          
            // 2. Get owner details (contains stationRequests = station IDs)
            const response = await fetch(`${API}/api/auth/user`, {
              method: "GET",
              headers: {
                Authorization: authorizationToken,
              },
            });            
            const it = await response.json();
            const owner = it.userData;
          
            // 3. Get station names for each pending station request
            const pendingStationRequests = await Promise.all(
              owner.stationRequests.map(async (stationId) => {
                const station = await stationService.getStationById(stationId);
                return {
                  type: "station",
                  stationId: stationId,
                  stationName: station?.name || "Unknown Station"
                };
              })
            );
          
            // 4. Transform pending bookings
            const pendingBookingRequests = pendingRequests.map(req => ({
              type: "booking",
              startTime: req.startTime,
              endTime: req.endTime,
              portId: req.portId,
              userId: req.userId._id,
              userName: req.userId.name,
              bookingId: req._id,
              stationId: req.stationId   // <-- carry forward stationId
            }));            
          
            // 5. Combine everything
            const allPending = [
              ...pendingStationRequests,
              ...pendingBookingRequests
            ];
          
            setOwnerNotifications({
              total: allPending.length,
              allPending
            });
            break;
          



          case 'admin':
              const adminPendingRequests = await stationService.getAllPendingStations();
              console.log("Stations:", adminPendingRequests);
              

              const usersResponse = await authService.getAllUsers();
              const users = usersResponse.users; // response shape: { users: [...] }

              // Build lookup map: { userId: userName }
              const userMap = users.reduce((map, user) => {
                map[user._id] = user.name;
                return map;
              }, {});

              // Merge owner name into stations
              const pendingStations = adminPendingRequests.map(station => ({
                name: station.name,
                ownerId: station.owner,
                ownerName: userMap[station.owner] || "Unknown Owner", // replace id with name
                createdAt: station.createdAt,
                id : station._id
              }));

              setAdminNotifications({
                pendingStationRequestsLength: pendingStations.length,
                totalPendingActionsLength: pendingStations.length,
                pendingStations
              });
              break;
           
      }
    } catch (error) {
      console.log(user)
      console.error('Error fetching notifications:', error);
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
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [user]);


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