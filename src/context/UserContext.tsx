'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the user object
interface User {
  username: string;
  id: number | null; // User ID (null if not logged in)
}

// Define the shape of the context
interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: { username: "", id: null },
  setUser: () => {},
});

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap the app
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { username: "", id: null };
    }
    return { username: "", id: null };
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user.username) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}