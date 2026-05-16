import { ENV } from "./configs/index.js";
import app from "./app.js";
import chalk from "chalk";

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(
    `
${chalk.green.bold("🚀 Backend Server Started")}
${chalk.cyan("🌐 Local")}   : http://localhost:${PORT}
${chalk.yellow("🧪 Mode")}    : ${ENV.NODE_ENV}
${chalk.magenta("⏰ Started")} : ${new Date().toLocaleString()}
`,
  );
});
