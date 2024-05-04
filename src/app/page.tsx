"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import BetCard from "@/components/BetCard";
import { Bet, WeatherBet } from "@/lib/types";
import MUIWeatherWidget from "@/components/MUIWeatherWidget";
import { cities } from "@/lib/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useAccount } from "wagmi";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  useIDKit,
} from "@worldcoin/idkit";
import verifyWorldId from "@/lib/verifyWorldId";
import { useToast } from "@/components/ui/use-toast";

import { useReadContract, useWriteContract } from "wagmi";
import { abi } from "@/lib/fujiAbi";

import { fujiContract, parseDate } from "@/lib/utils";

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

type Pool = {
  day_time: string;
  location: string;
  owner_address: string;
  pool_ID: number;
  token_address: string;
  weather: number;
};

type Record = {
  amount: number;
  bool_bet: boolean;
  chain_ID: number;
  pool_ID: number;
  user_address: string;
};

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

  const account = useAccount();

  const { setOpen } = useIDKit();
  const { toast } = useToast();

  const [currentData, setCurrentData] = useState<Bet>();

  // WORLDCOIN
  const onSuccess = (result: ISuccessResult) => {
    toast({
      title: "Sending WorldID Proof to backend...",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(result, null, 2)}</code>
        </pre>
      ),
    });

    handleVerifyWorldId(result);
  };

  const handleVerifyWorldId = async (result: ISuccessResult) => {
    try {
      const verificationResult = await verifyWorldId(
        result,
        process.env.NEXT_PUBLIC_WLD_BET_ACTION as string
      );
      if (verificationResult.code === "success") {
        toast({
          title: "Verified WorldID Proof!",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-green-700 p-4">
              <code className="text-white">
                {JSON.stringify(verificationResult.detail, null, 2)}
              </code>
            </pre>
          ),
        });

        handleWeb3();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to verify!",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-red-700 p-4">
              <code className="text-white">{verificationResult.detail}</code>
            </pre>
          ),
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      // Handle unexpected errors (e.g., network issues)
    }
  };

  const { writeContractAsync } = useWriteContract();

  const handleWeb3 = async () => {
    // make a bet
    console.log(
      "Betting in a pool",
      JSON.stringify(
        {
          userAddress: account.address,
          betAmount: currentData.betAmount,
          weatherBetId: currentData.weatherBetId,
          chainID: 1,
          betType: currentData.betType,
        },
        null,
        2
      )
    );

    const result = await writeContractAsync({
      abi,
      address: fujiContract,
      functionName: "userBetERC20",
      args: [
        account.address,
        BigInt(currentData.betAmount * 10 ** 6),
        BigInt(currentData.weatherBetId),
        1,
        currentData.betType,
      ],
    });

    toast({
      title: "Bet Placed!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-green-700 p-4">
          <code className="text-white">{result}</code>
        </pre>
      ),
    });
  };

  // FETCHING DATA ENDPOINT
  const {
    data: poolsData,
    isError: poolsError,
    isLoading: poolsLoading,
  } = useReadContract({
    abi,
    address: fujiContract,
    functionName: "getAllPools",
  });

  const {
    data: recordsData,
    isError: recordsError,
    isLoading: recordsLoading,
  } = useReadContract({
    abi,
    address: fujiContract,
    functionName: "getAllRecords",
  });

  const fetchBets = async () => {
    console.log("all datas", poolsData, recordsData);

    const weatherTypes = ["Sunny", "Rainy", "Cloudy", "Snowy"];

    const newPoolData = poolsData.map((pool: Pool) => {
      const parsedDate = parseDate(pool.day_time); // Convert string to Date object
      return {
        id: pool.pool_ID.toString(),
        location: pool.location,
        date: parsedDate.toISOString().split("T")[0], // Use ISO format for consistency
        weather: weatherTypes[Number(pool.weather)],
        totalPool: 0,
        betRatio: 0,
      };
    });

    // Sorting by date (newest first)
    newPoolData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Process records data...
    (recordsData as Record[]).forEach((record: Record) => {
      const pool = newPoolData.find((p) => p.id === record.pool_ID.toString());
      if (pool) {
        pool.totalPool += Number(record.amount);
        if (record.bool_bet) {
          pool.betRatio += Number(record.amount);
        }
      }
    });

    newPoolData.forEach((pool) => {
      pool.betRatio = Math.floor((pool.betRatio / pool.totalPool) * 100);
      pool.totalPool = pool.totalPool / 10 ** 6;
    });

    console.log("NEW POOL DATA sorted by date", newPoolData);

    setGlobalBets([...newPoolData, ...exampleTransactions]);
  };

  useEffect(() => {
    if (!poolsData || !recordsData) return;
    fetchBets();
  }, [poolsData, recordsData, account.address]);

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
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_WLD_BET_ACTION!}
        verification_level={VerificationLevel.Device}
        onSuccess={onSuccess}
      />
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
          globalBets.map((tx) => (
            <BetCard
              key={tx.id}
              wBet={tx}
              openWorldId={setOpen}
              setCurrentData={setCurrentData}
            />
          ))
        ) : account.isConnected ? (
          myBets.map((tx) => (
            <BetCard
              key={tx.id}
              wBet={tx}
              openWorldId={setOpen}
              setCurrentData={setCurrentData}
            />
          ))
        ) : (
          <p>Please connect your wallet to view your bets</p>
        )}
      </div>
    </>
  );
}
