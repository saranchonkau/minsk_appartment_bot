const esbuild = require("esbuild");
const path = require("path");
const chalk = require("chalk");
const { spawn } = require("child_process");
const { rm } = require("fs/promises");

const APP_DIRECTORY = "src";
const APP_ENTRY_POINT = path.join(APP_DIRECTORY, "index.ts");
const BUILD_DIRECTORY = "dist";
const BUILD_DIRECTORY_PATH = path.resolve(__dirname, "..", BUILD_DIRECTORY);
const APP_BUILD_FILE = path.join(BUILD_DIRECTORY, "server.js");

class App {
  constructor() {
    this.appProcess = null;
  }

  removeDistFolder() {
    return rm(BUILD_DIRECTORY_PATH, { recursive: true, force: true });
  }

  async build() {
    const isProduction = process.env.NODE_ENV === "production";

    const start = process.hrtime.bigint();

    await this.removeDistFolder();

    return esbuild
      .build({
        entryPoints: [APP_ENTRY_POINT],
        bundle: true,
        outfile: APP_BUILD_FILE,
        target: "node14.15",
        platform: "node",
        logLevel: "debug",
        incremental: !isProduction,
      })
      .then((buildResult) => {
        const end = process.hrtime.bigint();
        console.log(chalk.cyan(`Build took ${(end - start) / 1000_0000n}ms`));

        return buildResult;
      })
      .catch(() => {
        this.stop();
        process.exit(1);
      });
  }

  start() {
    console.log(chalk.greenBright("Starting..."));

    this.appProcess = spawn("node", [APP_BUILD_FILE], { stdio: "inherit" });
  }

  stop() {
    if (this.appProcess) {
      console.log(chalk.red("Killing app process..."));
      this.appProcess.kill();
    }
  }

  restart() {
    console.log(chalk.yellow("Restarting..."));
    this.stop();
    this.start();
  }
}

const app = new App();

module.exports = { app, APP_DIRECTORY };
