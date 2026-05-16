import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { ENV } from "../configs/index.js";
import { registerSocketHandlers } from "./handlers/index.js";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  registerSocketHandlers(io);

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
}

export function getSocketStatus() {
  if (!io) {
    return { ready: false as const };
  }

  return {
    ready: true as const,
    path: "/socket.io",
    connectedClients: io.engine.clientsCount,
    handshakeTestUrl: "/socket.io/?EIO=4&transport=polling",
    events: {
      clientToServer: ["ping"],
      serverToClient: ["pong"],
    },
  };
}
