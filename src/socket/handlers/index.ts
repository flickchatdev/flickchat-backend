import { Server } from "socket.io";
import { registerConnectionHandlers } from "./connection.handler.js";

export function registerSocketHandlers(io: Server) {
  registerConnectionHandlers(io);
}
