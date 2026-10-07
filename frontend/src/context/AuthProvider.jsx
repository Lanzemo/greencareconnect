import { useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user: loggedInUser } = response.data.data;

    localStorage.setItem("token", token);

    /*
      Fetch the complete profile after login.
      This gives us fields such as:
      phone, location, bio, experience,
      skills and hourlyRate.
    */
    try {
      const profileResponse = await api.get("/users/profile");

      const completeUser = profileResponse.data.data;

      localStorage.setItem(
        "user",
        JSON.stringify(completeUser)
      );

      setUser(completeUser);

      return completeUser;
    } catch {
      /*
        If profile fetching fails, don't prevent login.
        Fall back to the basic login user.
      */

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      return loggedInUser;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/users/profile");

      const updatedUser = response.data.data;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Unable to refresh user profile:", error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

