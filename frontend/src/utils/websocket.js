import { getBackendUrl } from "../configs/serverSettings";

let socket;
const backendURL = getBackendUrl();
export const connectWebSocket = (backendURL) => {
  socket = new WebSocket(backendURL);

  socket.onopen = () => console.log("Connected to WebSocket");
  socket.onclose = () => console.log("Disconnected from WebSocket");
  socket.onerror = (error) => console.error("WebSocket error:", error);
};

export const sendUpdate = (postItId, updates, userId) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not connected.");
    return;
  }

  socket.send(JSON.stringify({ event: "updatePostIt", postItId, updates, userId }));
};
