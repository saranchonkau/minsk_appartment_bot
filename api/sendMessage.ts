import fetch from "../fetch";
import { resolveBotUrl } from "./resolveBotUrl";

/**
 * https://api.telegram.org/bot<Bot_token>/sendMessage?chat_id=<chat_id>&text=<text>>
 * @param message
 */
export function sendMessage(message: string): Promise<void> {
  const url = resolveBotUrl("/sendMessage");
  url.searchParams.set("chat_id", process.env.CHAT_ID);
  url.searchParams.set("text", message);

  return fetch(url);
}
