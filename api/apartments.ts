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

export function getApartments(
  filterParams: Array<{ [key: string]: string | number }>
): Promise<ApartmentListResponse> {
  const url = new URL("https://r.onliner.by/sdapi/ak.api/search/apartments");
  const params = url.searchParams;

  const pairs: Array<[string, string | number]> = [];
  for (let param of filterParams) {
    pairs.push(...Object.entries(param));
  }

  for (let pair of pairs) {
    params.append(pair[0], String(pair[1]));
  }

  return fetch<ApartmentListResponse>(url);
}
