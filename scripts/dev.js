const pc = require("picocolors");
const { app } = require("./app");
const { runTypechecking } = require("./typecheck");

const tsProcess = runTypechecking();

app.build().then((bundle) => {
  console.log(pc.green("Starting..."));
  app.start();

  app.onChange(() => {
    console.log(pc.yellow("Rebuilding..."));

    const start = process.hrtime.bigint();

    bundle.rebuild().then(() => {
      const end = process.hrtime.bigint();
      console.log(pc.cyan(`Rebuild took ${(end - start) / 1000_0000n}ms`));

      console.log(pc.yellow("Restarting..."));
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
  console.log(pc.red("Dev server exit"));
});
