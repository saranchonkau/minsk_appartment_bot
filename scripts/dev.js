const chokidar = require("chokidar");
const chalk = require("chalk");
const { app, APP_DIRECTORY } = require("./app");

app.build().then((bundle) => {
  app.start();

  chokidar
    .watch(APP_DIRECTORY, { ignoreInitial: true })
    .on("all", (event, path) => {
      console.log(chalk.yellow("Rebuilding..."));

      const start = process.hrtime.bigint();
      bundle.rebuild().then(() => {
        const end = process.hrtime.bigint();
        console.log(chalk.cyan(`Rebuild took ${(end - start) / 1000_0000n}ms`));

        app.restart();
      });
    });
});

function handle(signal) {
  console.log(chalk.yellow(`Received ${signal}`));
  process.exit();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);

process.on("exit", () => {
  console.log(chalk.red("exit"));
  app.stop();
});
