import fetch from "../fetch";
import { resolveBotUrl } from "./resolveBotUrl";

/**
 * https://api.telegram.org/bot<Bot_token>/sendMessage?chat_id=<chat_id>&text=<text>>
 */
export function sendMessage(params: {
  botToken: string;
  chatId: string | number;
  message: string;
}): Promise<void> {
  const url = resolveBotUrl(params.botToken, "/sendMessage");
  url.searchParams.set("chat_id", String(params.chatId));
  url.searchParams.set("text", params.message);

  return fetch(url);
}
