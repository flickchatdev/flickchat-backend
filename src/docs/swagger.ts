import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "FlickChat API",
      version: "1.0.0",
      description:
        "FlickChat Backend API Documentation.\n\n" +
        "**Real-time (Socket.io):** REST endpoints cannot open a WebSocket from Swagger UI. " +
        "Use `GET /socket/health` to confirm Socket.io is running, then connect with " +
        "[socket.io-client](https://socket.io/docs/v4/client-api/) to the same base URL as this API.",
    },

    tags: [
      { name: "Health", description: "Server health checks" },
      { name: "Socket", description: "Socket.io status (REST probe)" },
      { name: "Authentication", description: "Login and OTP" },
    ],

    servers: [
      {
        url: "http://localhost:8080",
        description: "Development Server",
      },
    ],
  },

  apis: ["./src/routes/*.ts", "./src/app.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
