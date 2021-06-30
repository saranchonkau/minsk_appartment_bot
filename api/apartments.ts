import { URL } from "url";
import fetch from "../fetch";

enum Currency {
  USD = "USD",
  BYN = "BYN",
}

interface MoneyAmountModel {
  amount: string;
  currency: Currency;
}

export interface ApartmentModel {
  id: number;
  price: {
    amount: string;
    currency: Currency;
    converted: Record<Currency, MoneyAmountModel>;
  };
  rent_type: string;
  location: {
    address: string;
    user_address: string;
    latitude: number;
    longitude: number;
  };
  photo: string;
  contact: {
    owner: boolean;
  };
  created_at: string;
  last_time_up: string;
  up_available_in: number;
  url: string;
}

interface PaginationModel {
  current: number;
  items: number;
  last: number;
  limit: number;
}

interface ApartmentListResponse {
  apartments: Array<ApartmentModel>;
  page: PaginationModel;
  total: number;
}

export function getApartments(): Promise<ApartmentListResponse> {
  const url = new URL("https://r.onliner.by/sdapi/ak.api/search/apartments");
  const params = url.searchParams;
  // params.append("rent_type[]", "1_room");
  params.append("rent_type[]", "2_rooms");
  params.append("price[min]", "250");
  params.append("price[max]", "400");
  params.append("currency", "usd");
  params.append("metro[]", "red_line");
  params.append("metro[]", "blue_line");
  params.append("bounds[lb][lat]", "53.62870756249745");
  params.append("bounds[lb][long]", "27.14187910023304");
  params.append("bounds[rt][lat]", "54.050871244278255");
  params.append("bounds[rt][long]", "27.83951093617054");
  params.append("page", "1");
  params.append("order", "last_time_up:desc");

  return fetch<ApartmentListResponse>(url);
}
