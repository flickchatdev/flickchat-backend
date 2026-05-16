import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "FlickChat API",
      version: "1.0.0",
      description: "FlickChat Backend API Documentation",
    },

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
