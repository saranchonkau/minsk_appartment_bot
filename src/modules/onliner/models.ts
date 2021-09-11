enum Currency {
  USD = "USD",
  BYN = "BYN",
}

export interface MoneyAmountModel {
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

export interface PaginationModel {
  current: number;
  items: number;
  last: number;
  limit: number;
}

export interface ApartmentListResponse {
  apartments: Array<ApartmentModel>;
  page: PaginationModel;
  total: number;
}
