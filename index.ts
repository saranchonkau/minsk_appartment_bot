import { config } from "dotenv";
import { createServer } from "http";
import { ApartmentModel, getApartments } from "./api/apartments";
import { sendMessage } from "./api/sendMessage";

config();

const server = createServer();

let newApartment: ApartmentModel | null = null;

function checkNewApartment() {
  getApartments().then((response) => {
    const latestApartment = response.apartments[0];

    if (latestApartment.id === newApartment?.id) return;

    newApartment = latestApartment;

    const rows = [
      `Ссылка: ${newApartment.url}`,
      `Цена: ${newApartment.price.converted.USD.amount} USD (${newApartment.price.converted.BYN.amount} BYN)`,
      `Обновлено: ${new Date(newApartment.last_time_up).toLocaleString(
        "ru-BY"
      )}`,
    ];
    const message = rows.join("\n");

    console.log("New Apartment: ");
    console.log(message);

    sendMessage(message);
  });
}

server.listen(8080, () => {
  console.log("Server listen port: 8080");

  setInterval(checkNewApartment, 20 * 1000);
});
