const { spawn } = require("child_process");
const pc = require("picocolors");

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
      console.error(pc.red(str));
    } else {
      console.log(pc.cyan(str));
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
