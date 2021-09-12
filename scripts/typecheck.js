const { spawn } = require("child_process");
const chalk = require("chalk");

function runTypechecking() {
  const child = spawn("tsc", ["--watch", "--incremental", "--noEmit"], {
    stdio: "pipe",
  });

  function handleTsMessage(data) {
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

  child.on("data", handleTsMessage);
  child.stdout.on("data", handleTsMessage);
  child.stderr.on("data", handleTsMessage);

  return child;
}

module.exports = {
  runTypechecking,
};
