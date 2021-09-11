import { URL } from "url";
import fetch from "../fetch";
import cheerio from "cheerio";

export interface RealtApartmentModel {
  highlighted: boolean;
  price: string;
  link: string;
  date: string;
  id: string;
  address: string;
}

export function getApartmentsFromRealt(filterParams: {
  url: string;
}): Promise<Array<RealtApartmentModel>> {
  const url = new URL(filterParams.url);

  return fetch<string>(url).then((html) => {
    const $ = cheerio.load(html);

    const apartments: Array<RealtApartmentModel> = [];

    $('.listing-item[data-mode="3"]').each((index, element) => {
      const apartment: RealtApartmentModel = {
        highlighted: $(element).hasClass("highlighted"),
        price: $(element)
          .find(".teaser-tile-left .desc-mini-bottom .col-auto")
          .text()
          .trim(),
        link: $(element).find(".teaser-tile-left a.image").attr("href") || "",
        date: $(element)
          .find(".teaser-tile-right .desc .info-mini span")
          .eq(2)
          .text()
          .trim(),
        id: $(element)
          .find(".teaser-tile-right .desc .info-mini span")
          .eq(3)
          .text()
          .trim()
          .slice(3),
        address: $(element)
          .find(".teaser-tile-right .desc .location")
          .text()
          .trim(),
      };

      apartments.push(apartment);
    });

    return apartments.filter((apartment) => !apartment.highlighted);
  });
}
