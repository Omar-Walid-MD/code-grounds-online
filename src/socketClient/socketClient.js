import io from "socket.io-client";
const url = "localhost:8000";

export const socket = io(url);
