import { createServer } from "http";
import { Temporal } from "proposal-temporal";
import {
  ApartmentModel,
  getApartmentsFromOnliner,
} from "./api/apartmentsOnliner";
import { sendMessage } from "./api/sendMessage";
import { config, UserModel } from "./config";
import {
  getApartmentsFromRealt,
  RealtApartmentModel,
} from "./api/apartmentsRealt";

const server = createServer((req, res) => {
  if (req.url === "/users") {
    res.write(JSON.stringify(config, null, 4));
  } else {
    res.write("Server is ok");
  }
  res.end();
});

const newOnlinerApartmentMap = new Map<string, ApartmentModel>();
const newRealtApartmentMap = new Map<string, RealtApartmentModel>();

function formatDate(isoDate: string): string {
  const instant = Temporal.Instant.from(isoDate);
  return instant.toZonedDateTimeISO("Europe/Minsk").toLocaleString("ru-BY");
}

function convertOnlinerApartmentToMessage(
  userName: string,
  apartment: ApartmentModel
): string {
  const rows = [
    `User: ${userName}`,
    `Provider: Onliner`,
    `ID: ${apartment.id}`,
    `Ссылка: ${apartment.url}`,
    `Цена: ${apartment.price.converted.USD.amount} USD (${apartment.price.converted.BYN.amount} BYN)`,
    `Обновлено: ${formatDate(apartment.last_time_up)}`,
    `Адрес: ${apartment.location.address}`,
    `v0.1.10`,
  ];

  return rows.join("\n");
}

function convertRealtOnlinerApartmentToMessage(
  userName: string,
  apartment: RealtApartmentModel
): string {
  const rows = [
    `User: ${userName}`,
    `Provider: Realt`,
    `ID: ${apartment.id}`,
    `Ссылка: ${apartment.link}`,
    `Цена: ${apartment.price}`,
    `Обновлено: ${apartment.date}`,
    `Адрес: ${apartment.address}`,
    `v0.1.10`,
  ];

  return rows.join("\n");
}

function checkNewApartment(user: UserModel) {
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

  getApartmentsFromOnliner(user.config.onliner_params).then((response) => {
    const latestApartment = response.apartments[0];

    let newApartment = newOnlinerApartmentMap.get(user.name);

    if (latestApartment.id === newApartment?.id) return;

    newOnlinerApartmentMap.set(user.name, latestApartment);
    newApartment = latestApartment;

    const message = convertOnlinerApartmentToMessage(user.name, newApartment);
    console.log("New Onliner Apartment: ");
    console.log(message);

    sendMessage({
      botToken: user.config.bot_token,
      chatId: user.config.chat_id,
      message,
    }).catch((error) => {
      sendMessage({
        botToken: user.config.bot_token,
        chatId: user.config.chat_id,
        message: `Error Onliner.by: ${error.message}`,
      });
    });
  });
}

server.listen(8080, () => {
  console.log("Server listen port: 8080");

  config.users.map((user) => {
    setInterval(() => checkNewApartment(user), 10 * 1000);
  });
});
