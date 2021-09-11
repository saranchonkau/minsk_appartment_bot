import { URL } from "url";

export function resolveBotUrl(botToken: string, path: string): URL {
  const base = "https://api.telegram.org/bot<Bot_token>".replace(
    "<Bot_token>",
    botToken
  );

  return new URL(base + path);
}
