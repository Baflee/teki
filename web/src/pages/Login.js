import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [socket, setSocket] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    setIsWaiting(true);
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
      <div className="flex items-center flex-grow justify-left">
        <div className="p-10 text-left">
          <h1 className="mb-2 text-5xl font-bold text-white">
            Welcome to your dashboard
          </h1>
          <p className="mb-6 text-gray-400">Authenticate using your NFC card</p>
          <button
            onClick={handleLogin}
            className={[
              "flex items-center gap-2 bg-[#E6F0FF] font-bold text-gray-800 px-4 py-2 rounded hover:bg-blue-200 transition duration-300",
              isWaiting && "animate-pulse"
              ].join(" ")}
          >
          {isWaiting && <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24"><g><circle cx="12" cy="2.5" r="1.5" fill="#adadad" opacity=".14"/><circle cx="16.75" cy="3.77" r="1.5" fill="#adadad" opacity=".29"/><circle cx="20.23" cy="7.25" r="1.5" fill="#adadad" opacity=".43"/><circle cx="21.5" cy="12" r="1.5" fill="#adadad" opacity=".57"/><circle cx="20.23" cy="16.75" r="1.5" fill="#adadad" opacity=".71"/><circle cx="16.75" cy="20.23" r="1.5" fill="#adadad" opacity=".86"/><circle cx="12" cy="21.5" r="1.5" fill="#adadad"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>
          </div>}
            Login with Taki Mobile App
          </button>
        
        </div>
      </div>
    </div>
  );
};

export default Login;
