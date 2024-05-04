"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import BetCard from "@/components/BetCard";
import { useActiveAccount } from "thirdweb/react";
import { WeatherBet } from "@/lib/types";
import MUIWeatherWidget from "@/components/MUIWeatherWidget";
import { cities } from "@/lib/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

// 替换为您的 WeatherAPI API 密钥
const API_KEY = "f58dd287627a480792875942240405";

// 示例交易数据
const exampleTransactions: WeatherBet[] = [
  {
    id: "1",
    location: "San Francisco, CA",
    date: "2024-05-01",
    weather: "Sunny",
    totalPool: 5000.0,
    betRatio: 50,
  },
  {
    id: "2",
    location: "New York, NY",
    date: "2024-05-02",
    weather: "Rainy",
    totalPool: 7500.0,
    betRatio: 15,
  },
  {
    id: "3",
    location: "Chicago, IL",
    date: "2024-05-01",
    weather: "Cloudy",
    totalPool: 3000.0,
    betRatio: 80,
  },
  {
    id: "4",
    location: "Miami, FL",
    date: "2024-05-03",
    weather: "Sunny",
    totalPool: 8500.0,
    betRatio: 20,
  },
  {
    id: "5",
    location: "Seattle, WA",
    date: "2024-05-01",
    weather: "Rainy",
    totalPool: 6200.0,
    betRatio: 42,
  },
];

const fetchWeather = async (location: string) => {
  const encodedLocation = encodeURIComponent(location);
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodedLocation}&lang=en`
    );
    return response.data.current.condition.text;
  } catch (error) {
    console.error("Weather API error:", error);
    return "Unavailable";
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"Global" | "Me">("Global");
  const [globalBets, setGlobalBets] = useState<WeatherBet[]>([]);
  const [myBets, setMyBets] = useState<WeatherBet[]>([]);
  const account = useActiveAccount();

  const fetchBets = async () => {
    // 更新每个交易的实时天气
    const fetchedBets = await Promise.all(
      exampleTransactions.map(async (tx) => {
        const weather = await fetchWeather(tx.location);
        return {
          ...tx,
          weather,
          date: new Date().toISOString().split("T")[0],
          totalPool: Math.floor(Math.random() * 10000) + 1000,
          betRatio: Math.floor(Math.random() * 100) + 1,
        };
      })
    );

    // 更新 globalBets 和 myBets 状态
    setGlobalBets(fetchedBets);
    setMyBets(fetchedBets.filter((tx) => tx.location === "San Francisco, CA"));
  };

  useEffect(() => {
    fetchBets();
  }, []);

  // 轮播设置
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center min-w-full">
        <h1 className="text-3xl font-semibold tracking-tight">
          #1 Global Weather Better
        </h1>

        <div className="max-w-md">
          <Slider {...sliderSettings}>
            {/* <MUIWeatherWidget city={cities.sydney} />
            <MUIWeatherWidget city={cities.beijing} />
            <MUIWeatherWidget city={cities.berkeley} /> */}
          </Slider>
        </div>
        <Link href="/bet">
          <Button className="bg-indigo-500 hover:bg-indigo-400">
            Bet on weather, don&apos;t be a bed wetter, make the world better
            and be a weather better
          </Button>
        </Link>

        <div className="flex justify-start min-w-full gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400 ">
          <div
            className={`cursor-pointer py-4 ${
              activeTab === "Global"
                ? "text-indigo-500 decoration-indigo-500 underline-offset-4 underline"
                : ""
            }`}
            onClick={() => setActiveTab("Global")}
          >
            global
          </div>
          <div
            className={`cursor-pointer py-4 ${
              activeTab === "Me"
                ? "text-indigo-500 decoration-indigo-500 underline-offset-4 underline"
                : ""
            }`}
            onClick={() => setActiveTab("Me")}
          >
            me
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full">
        {activeTab === "Global" ? (
          globalBets.map((tx) => <BetCard key={tx.id} {...tx} />)
        ) : account?.address ? (
          myBets.map((tx) => <BetCard key={tx.id} {...tx} />)
        ) : (
          <p>Please connect your wallet to view your bets</p>
        )}
      </div>
    </>
  );
}
