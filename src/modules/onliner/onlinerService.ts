import { URL } from "url";
import fetch from "../../fetch";
import { ApartmentListResponse, ApartmentModel } from "./models";
import { formatMessageDate } from "../../utils/formatMessageDate";
import { UserModel } from "../../config";
import { sendMessage } from "../../utils/sendMessage";

export class OnlinerService {
  previousApartment: ApartmentModel | null;
  user: UserModel;

  constructor(user: UserModel) {
    this.user = user;
    this.previousApartment = null;
  }

  async checkNewApartment() {
    const response = await this.getApartmentsFromOnliner();
    const newestApartment = response.apartments[0];

    if (!newestApartment) return;

    if (this.shouldSendMessage(newestApartment)) {
      this.previousApartment = newestApartment;
      const message = this.convertApartmentToMessage(newestApartment);
      await sendMessage({
        botToken: this.user.config.bot_token,
        chatId: this.user.config.chat_id,
        message,
      }).catch((error) => {
        sendMessage({
          botToken: this.user.config.bot_token,
          chatId: this.user.config.chat_id,
          message: `Error Onliner.by: ${error.message}`,
        });
      });
    }
  }

  getApartmentsFromOnliner(): Promise<ApartmentListResponse> {
    const url = new URL("https://r.onliner.by/sdapi/ak.api/search/apartments");
    const params = url.searchParams;

    const pairs: Array<[string, string | number]> = [];
    for (let param of this.user.config.onliner_params) {
      pairs.push(...Object.entries(param));
    }

    for (let pair of pairs) {
      params.append(pair[0], String(pair[1]));
    }

    return fetch<ApartmentListResponse>(url, { json: true });
  }

  convertApartmentToMessage(apartment: ApartmentModel): string {
    const rows = [
      `User: ${this.user.name}`,
      `Provider: Onliner`,
      `ID: ${apartment.id}`,
      `Ссылка: ${apartment.url}`,
      `Цена: ${apartment.price.converted.USD.amount} USD (${apartment.price.converted.BYN.amount} BYN)`,
      `Обновлено: ${formatMessageDate(apartment.last_time_up)}`,
      `Адрес: ${apartment.location.address}`,
      `v0.1.10`,
    ];

    return rows.join("\n");
  }

  shouldSendMessage(newestApartment: ApartmentModel) {
    console.log("prev: ", this.previousApartment?.id);
    console.log("new: ", newestApartment?.id);
    return this.previousApartment?.id !== newestApartment?.id;
  }
}
