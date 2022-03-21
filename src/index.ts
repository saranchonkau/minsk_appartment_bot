import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "./config";
import * as pc from "picocolors";
import { OnlinerService } from "./modules/onliner/onlinerService";
import { sendMessage } from "./utils/sendMessage";

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.url === "/users") {
    res.write(JSON.stringify(config, null, 4));
  } else {
    res.write("Server is ok");
  }
  res.end();
}

const server = createServer(handleRequest);

server.listen(8080, () => {
  console.log("Server listen port: 8080");
});

config.users.map((user) => {
  const onliner = new OnlinerService(user);

  setInterval(() => {
    onliner.checkNewApartment().catch(console.error);
  }, 10_000);
});

function handleSignal() {
  process.exit();
}

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);

process.on("exit", async () => {
  const user = config.users[0]!;

  await sendMessage({
    botToken: user.config.bot_token,
    chatId: user.config.chat_id,
    message: "App exit !",
  });
  console.log(pc.gray("App exit"));
});
