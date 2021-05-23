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
  params.append("rent_type[]", "1_room");
  params.append("price[min]", "150");
  params.append("price[max]", "500");
  params.append("currency", "usd");
  params.append("bounds[lb][lat]", "53.849283137485706");
  params.append("bounds[lb][long]", "27.366820851088725");
  params.append("bounds[rt][lat]", "53.954668315837715");
  params.append("bounds[rt][long]", "27.5412288100731");
  params.append("page", "1");
  params.append("v", "0.03358886326053345");

  return fetch<ApartmentListResponse>(url);
}
