const chalk = require("chalk");
const { app } = require("./app");
const { runTypechecking } = require("./typecheck");

const tsProcess = runTypechecking();

app.build().then((bundle) => {
  console.log(chalk.greenBright("Starting..."));
  app.start();

  app.onChange(() => {
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

function handleProcessEvent() {
  process.exit();
}

process.on("SIGINT", handleProcessEvent);
process.on("SIGTERM", handleProcessEvent);

process.on("exit", () => {
  app.stop();
  tsProcess.kill();
  console.log(chalk.red("Dev server exit"));
});
