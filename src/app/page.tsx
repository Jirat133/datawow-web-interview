"use client";
import Image from "next/image";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext, UserProvider } from "../context/UserContext"; // Import UserContext
import AboardLogo from './asset/image/aboard_logo.png'; // Adjust the path as necessary


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
      setUser({
        username: data.username,
        id: data.id,
      }); 
      router.push("/home");
    } catch (error) {
      alert("Login failed. Please try again.");
      console.error("Error during login:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen bg-custom-green-500">
      {/* Sign In part */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full">
        <h1 className="text-white font-bold text-5xl mb-8">Sign In</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsernameLocal(e.target.value)}
          className="mt-4 p-3 text-lg rounded border border-gray-300 w-72"
        />
        <button
          onClick={handleLogin}
          className="mt-6 p-3 text-lg font-semibold text-white bg-custom-green-success rounded hover:bg-green-400 w-72"
        >
          Sign In
        </button>
      </div>

      {/* Logo part */}
      <div className="relative bg-custom-green-300 md:w-1/2 w-full rounded-b-[50px] md:rounded-b-none md:rounded-tl-[50px] md:rounded-bl-[50px] flex justify-center items-center">
        <div className="text-center">
          <Image src={AboardLogo} alt="A board" width={200} height={200} />
          <p className="text-white text-2xl mt-4">A Board</p>
        </div>
      </div>
    </div>
  );

}
