import { createServer } from "http";
import { ENV } from "./configs/index.js";
import app from "./app.js";
import { initSocket } from "./socket/index.js";
import chalk from "chalk";

const PORT = ENV.PORT;
const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `
${chalk.green.bold("🚀 Backend Server Started")}
${chalk.cyan("🌐 Local")}   : http://localhost:${PORT}
${chalk.blue("🔌 Socket")}  : ws://localhost:${PORT}
${chalk.yellow("🧪 Mode")}    : ${ENV.NODE_ENV}
${chalk.magenta("⏰ Started")} : ${new Date().toLocaleString()}
`,
  );
});
