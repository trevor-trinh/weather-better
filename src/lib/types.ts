export type WeatherBet = {
  id: string;
  location: string;
  date: string;
  weather: WeatherTypes;
  totalPool: number;
  betRatio: number;
};

export type WeatherTypes = "Sunny" | "Rainy" | "Cloudy" | "Snowy";

export type SupportedCities =
  | "shanghai"
  | "beijing"
  | "san-francisco"
  | "sydney";

export type Bet = {
  userAddress: string;
  weatherBetId: string;
  betAmount: number;
  betType: boolean;
};

export type VerifyReply = {
  code: string;
  detail: string;
};
