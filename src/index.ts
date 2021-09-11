import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "./config";
import * as chalk from "chalk";
import { OnlinerService } from "./modules/onliner/onlinerService";

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
    onliner.checkNewApartment();
  }, 10_000);
});

function handleSignal(signal: string) {
  console.log(chalk.yellow(`app Received ${signal}`));
  process.exit();
}

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);

process.on("exit", () => {
  console.log(chalk.redBright("app exit"));
});

// const newRealtApartmentMap = new Map<string, RealtApartmentModel>();
//
// function convertRealtOnlinerApartmentToMessage(
//   userName: string,
//   apartment: RealtApartmentModel
// ): string {
//   const rows = [
//     `User: ${userName}`,
//     `Provider: Realt`,
//     `ID: ${apartment.id}`,
//     `Ссылка: ${apartment.link}`,
//     `Цена: ${apartment.price}`,
//     `Обновлено: ${apartment.date}`,
//     `Адрес: ${apartment.address}`,
//     `v0.1.10`,
//   ];
//
//   return rows.join("\n");
// }

// function checkNewApartment(user: UserModel) {
// getApartmentsFromRealt(user.config.realt_params)
//   .then((apartments) => {
//     const latestApartment = apartments[0];
//
//     let newApartment = newRealtApartmentMap.get(user.name);
//
//     if (latestApartment.id === newApartment?.id) return;
//
//     newRealtApartmentMap.set(user.name, latestApartment);
//     newApartment = latestApartment;
//
//     const message = convertRealtOnlinerApartmentToMessage(
//       user.name,
//       newApartment
//     );
//     console.log("New Realt Apartment: ");
//     console.log(message);
//
//     sendMessage({
//       botToken: user.config.bot_token,
//       chatId: user.config.chat_id,
//       message,
//     });
//   })
//   .catch((error) => {
//     sendMessage({
//       botToken: user.config.bot_token,
//       chatId: user.config.chat_id,
//       message: `Error Realt.by: ${error.message}`,
//     });
//   });
// }
