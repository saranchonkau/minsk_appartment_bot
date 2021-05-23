import { URL } from "url";

export function resolveBotUrl(path: string): URL {
  const base = "https://api.telegram.org/bot<Bot_token>".replace(
    "<Bot_token>",
    process.env.BOT_TOKEN
  );

  return new URL(base + path);
}
