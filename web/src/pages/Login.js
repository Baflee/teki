import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const newSocket = new WebSocket("ws://localhost:8000/ws");

    newSocket.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };
    newSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const message = JSON.parse(event.data);
      if (message.type === "navigate_to_dashboard") {
        navigate("/dashboard");
      }
    };
    newSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#252C40]">
      <div className="p-4">
        <img src="../logo.svg" alt="Teki Logo" className="w-36" />
      </div>
      <div className="flex flex-grow items-center justify-left">
        <div className="text-left p-10">
          <h1 className="text-5xl font-bold text-white mb-2">
            Welcome to your dashboard
          </h1>
          <p className="text-gray-400 mb-6">Authenticate using your NFC card</p>
          <button
            onClick={handleLogin}
            className="bg-[#E6F0FF] font-bold text-gray-800 px-4 py-2 rounded hover:bg-blue-200 transition duration-300"
          >
            Login with Taki Mobile App
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
