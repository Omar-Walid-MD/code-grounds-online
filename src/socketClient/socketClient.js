import io from "socket.io-client";
const url = process.env.REACT_APP_WEBSOCKET_SERVER_URL || "localhost:8000";

export const socket = io(url);
