import io from "socket.io-client";
const url = 1 ? "https://code-grounds-online.onrender.com" : "localhost:8000";

export const socket = io(url);

// console.log(url);