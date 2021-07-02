import { createServer } from "http";
import { Temporal } from "proposal-temporal";
import { ApartmentModel, getApartments } from "./api/apartments";
import { sendMessage } from "./api/sendMessage";
import { config, UserModel } from "./config";

const server = createServer((req, res) => {
  if (req.url === "/users") {
    res.write(JSON.stringify(config, null, 4));
  } else {
    res.write("Server is ok");
  }
  res.end();
});

const newApartmentMap = new Map<string, ApartmentModel>();

function formatDate(isoDate: string): string {
  const instant = Temporal.Instant.from(isoDate);
  return instant.toZonedDateTimeISO("Europe/Minsk").toLocaleString("ru-BY");
}

function convertApartmentToMessage(
  userName: string,
  apartment: ApartmentModel
): string {
  const rows = [
    `User: ${userName}`,
    `ID: ${apartment.id}`,
    `Ссылка: ${apartment.url}`,
    `Цена: ${apartment.price.converted.USD.amount} USD (${apartment.price.converted.BYN.amount} BYN)`,
    `Обновлено: ${formatDate(apartment.last_time_up)}`,
    `Адрес: ${apartment.location.address}`,
    `v0.1.7`,
  ];

  return rows.join("\n");
}

function checkNewApartment(user: UserModel) {
  getApartments(user.config.onliner_params).then((response) => {
    const latestApartment = response.apartments[0];

    let newApartment = newApartmentMap.get(user.name);

    if (latestApartment.id === newApartment?.id) return;

    newApartmentMap.set(user.name, latestApartment);
    newApartment = latestApartment;

    const message = convertApartmentToMessage(user.name, newApartment);
    console.log("New Apartment: ");
    console.log(message);

    sendMessage({
      botToken: user.config.bot_token,
      chatId: user.config.chat_id,
      message,
    });
  });
}

server.listen(8080, () => {
  console.log("Server listen port: 8080");

  config.users.map((user) => {
    setInterval(() => checkNewApartment(user), 10 * 1000);
  });
});
