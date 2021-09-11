import { Temporal } from "proposal-temporal";

export function formatMessageDate(isoDate: string): string {
  const instant = Temporal.Instant.from(isoDate);
  return instant.toZonedDateTimeISO("Europe/Minsk").toLocaleString("ru-BY");
}
