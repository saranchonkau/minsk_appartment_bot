const chokidar = require("chokidar");
const chalk = require("chalk");
const { app, APP_DIRECTORY } = require("./app");
const { spawn } = require("child_process");
const { createWriteStream } = require("fs");

function runTypechecking() {
  const child = spawn("tsc", ["--watch", "--incremental", "--noEmit"], {
    stdio: "pipe",
  });

  function handle(data) {
    let str = data.toString();

    if (str.endsWith("\n")) {
      str = str.slice(0, -1 * "\n".length);
    }

    if (str.startsWith("")) {
      return;
    }

    if (str.includes("error TS")) {
      console.error(chalk.redBright(str));
    } else {
      console.log(chalk.cyan(str));
    }
  }

  child.on("data", handle);
  child.stdout.on("data", handle);
  child.stderr.on("data", handle);

  return child;
}

const tsProcess = runTypechecking();

app.build().then((bundle) => {
  console.log(chalk.greenBright("Starting..."));
  app.start();

  chokidar
    .watch(APP_DIRECTORY, { ignoreInitial: true })
    .on("all", (event, path) => {
      console.log(chalk.yellow("Rebuilding..."));

      const start = process.hrtime.bigint();
      bundle.rebuild().then(() => {
        const end = process.hrtime.bigint();
        console.log(chalk.cyan(`Rebuild took ${(end - start) / 1000_0000n}ms`));

        console.log(chalk.yellow("Restarting..."));
        app.restart();
      });
    });
});

function handle() {
  process.exit();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);

process.on("exit", () => {
  app.stop();
  tsProcess.kill();
  console.log(chalk.red("Dev server exit"));
});
