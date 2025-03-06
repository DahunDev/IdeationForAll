import { io } from "socket.io-client";
import { getBackendUrl } from "../configs/serverSettings";

let socket;

export const connectWebSocket = () => {
  const backendURL = getBackendUrl();
  console.log("Connect websocket url: " + backendURL);
  
  // Use Socket.io to connect
  socket = io(backendURL);

  socket.on("connect", () => {
    console.log("Connected to WebSocket");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

export const sendUpdate = (postItId, updates, idToken) => {
  if (!socket || !socket.connected) {
    console.error("WebSocket is not connected.");
    return;
  }

  socket.emit("updatePostIt", { postItId, updates, idToken });
};
