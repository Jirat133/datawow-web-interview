"use client";
import Image from "next/image";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext, UserProvider } from "../context/UserContext"; // Import UserContext


export default function Home() {
  const [username, setUsernameLocal] = useState("");
  const router = useRouter();
  const { setUser } = useContext(UserContext); // Access setUsername from context
  const handleLogin = async () => {
    try {
      // Perform login request
      const response = await fetch("http://localhost:3001/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      console.log("Login response data:", data);
      setUser({
        username: data.username,
        id: data.id, // Assuming the response contains userId
      }); // Set username in context
      router.push("/home");
      console.log("Login successful:", data);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <div style={{ backgroundColor: "green", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontWeight: "bold", fontSize: 50 }}>Sign In</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsernameLocal(e.target.value)}
        style={{
          marginTop: "20px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "250px",
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          color: "green",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}
