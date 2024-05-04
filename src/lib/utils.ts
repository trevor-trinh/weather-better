import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeatherTypes } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weatherIcon(weather: WeatherTypes) {
  switch (weather) {
    case "Sunny":
      return "🌞";
    case "Rainy":
      return "🌧️";
    case "Cloudy":
      return "☁️";
    case "Snowy":
      return "❄️";
    default:
      return "🌞";
  }
}

export const cities = {
  beijing: {
    name: "Beijing",
    coords: [39.9075, 116.3972],
  },
  sydney: {
    name: "Sydney",
    coords: [-33.8679, 151.2073],
  },
  berkeley: {
    name: "Berkeley",
    coords: [37.8716, -122.2728],
  },
};
