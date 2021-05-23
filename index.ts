import { config } from "dotenv";
import { createServer } from "http";
import { ApartmentModel, getApartments } from "./api/apartments";
import { sendMessage } from "./api/sendMessage";
import { Temporal } from "proposal-temporal";

config();

const server = createServer();

let newApartment: ApartmentModel | null = null;

function formatDate(isoDate: string): string {
  const instant = Temporal.Instant.from(isoDate);
  return instant.toZonedDateTimeISO("Europe/Minsk").toLocaleString("ru-BY");
}

function convertApartmentToMessage(apartment: ApartmentModel): string {
  const rows = [
    `Ссылка: ${apartment.url}`,
    `Цена: ${apartment.price.converted.USD.amount} USD (${apartment.price.converted.BYN.amount} BYN)`,
    `Обновлено: ${formatDate(apartment.last_time_up)}`,
  ];

  return rows.join("\n");
}

function checkNewApartment() {
  getApartments().then((response) => {
    const latestApartment = response.apartments[0];

    if (latestApartment.id === newApartment?.id) return;

    newApartment = latestApartment;

    const message = convertApartmentToMessage(newApartment);
    console.log("New Apartment: ");
    console.log(message);

    sendMessage(message);
  });
}

server.listen(8080, () => {
  console.log("Server listen port: 8080");

  setInterval(checkNewApartment, 20 * 1000);
});