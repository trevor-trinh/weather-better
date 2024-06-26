import { useState, useEffect } from "react";

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { WeatherBet, Bet } from "@/lib/types";
import { weatherIcon } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

import { useAccount } from "wagmi";

export default function BetDialog({
  wBet,
  setOpen,
  setDialogOpen,
  setCurrentData,
}: {
  wBet: WeatherBet;
  setOpen: (open: boolean) => void;
  setDialogOpen: (open: boolean) => void;
  setCurrentData: any;
}) {
  const [selectedBet, setSelectedBet] = useState<"pro" | "con" | undefined>();
  const [betAmount, setBetAmount] = useState(0);
  const account = useAccount();
  const { toast } = useToast();

  const handleBetSelection = (betType: "pro" | "con" | undefined) => {
    if (selectedBet === betType) {
      setSelectedBet(undefined);
    } else {
      setSelectedBet(betType);
    }
  };

  const handleChange = (e: any) => {
    setBetAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedBet) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please pick a side",
      });
      return;
    }

    if (!betAmount || betAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter valid bet amount",
      });
      return;
    }

    if (!account.isConnected) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please connect wallet",
      });
      return;
    }

    const bet: Bet = {
      betType: selectedBet === "pro" ? true : false,
      betAmount: betAmount,
      userAddress: account.address,
      weatherBetId: wBet.id,
    };

    setOpen(true);
    console.log(bet);

    toast({
      title: "You are submitting the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(bet, null, 2)}</code>
        </pre>
      ),
    });
    setCurrentData(bet);

    setDialogOpen(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">{wBet.location}</DialogTitle>
        <DialogDescription>{wBet.date}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-8 w-full">
        <div className="animate-bounce pt-4 pb-2 col-start-1 row-start-1 row-span-1 col-span-2">
          <p className="text-xl text-center">
            {weatherIcon(wBet.weather)} {wBet.weather}
          </p>
        </div>

        <div className="col-start-1 row-start-2 row-span-1 col-span-1">
          <p className="text-sm">Total Pool:</p>
          <p className="text-lg font-bold text-green-500">{`$${wBet.totalPool.toLocaleString()}`}</p>
        </div>

        <div className="col-start-1 row-start-3 row-span-1 col-span-1">
          <p className="text-sm">Sentiment:</p>
          <Progress value={wBet.betRatio} className="h-2" />
          <div className="flex justify-between px-2 py-1">
            <p className="text-xs text-gray-500">{`${wBet.betRatio}%`}</p>
            <p className="text-xs text-gray-500">{`${100 - wBet.betRatio}%`}</p>
          </div>
        </div>

        <div className="col-start-2 row-start-2 row-span-1 col-span-1">
          <p className="text-sm">Choose Your Bet:</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className={`text-xs py-2 ${
                selectedBet === "pro"
                  ? "bg-indigo-500 hover:bg-indigo-400 text-background hover:text-background"
                  : ""
              }`}
              onClick={() => handleBetSelection("pro")}
              variant="outline"
            >
              ✅ Pro {wBet.weather}
            </Button>
            <Button
              className={`text-xs py-2 ${
                selectedBet === "con"
                  ? "bg-indigo-500 hover:bg-indigo-400 text-background hover:text-background"
                  : ""
              }`}
              onClick={() => handleBetSelection("con")}
              variant="outline"
            >
              ❌ Con {wBet.weather}
            </Button>
          </div>
        </div>

        <div className="col-start-2 row-start-3 row-span-1 col-span-1">
          <p className="text-sm">Bet Amount:</p>
          <Input value={betAmount} type="number" onChange={handleChange} />
        </div>
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-2 w-full">
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400"
            onClick={handleSubmit}
          >
            BET
          </Button>
          <CountdownButton targetDate={wBet.date} />
        </div>
      </DialogFooter>
    </>
  );
}

const CountdownButton = ({ targetDate }) => {
  const [countdown, setCountdown] = useState("");

  const calculateCountdown = () => {
    const now = new Date();
    const endDate = new Date(targetDate);
    const timeDiff = endDate.getTime() - now.getTime(); // difference in milliseconds

    if (timeDiff > 0) {
      // Calculate time difference parts
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Format countdown string
      return `${days} day${days !== 1 ? "s" : ""} : ${hours} hour${
        hours !== 1 ? "s" : ""
      } : ${minutes} minute${minutes !== 1 ? "s" : ""} : ${seconds} second${
        seconds !== 1 ? "s" : ""
      }`;
    } else {
      return "The event date has arrived!";
    }
  };

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      const newCountdown = calculateCountdown();
      setCountdown(newCountdown);
    }, 500);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [targetDate]);

  return (
    <button
      className={`w-1/2 self-center py-2 ${
        countdown !== "The event date has arrived!"
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-yellow-600 hover:bg-yellow-500"
      }`}
      disabled={true}
    >
      {countdown !== "The event date has arrived!"
        ? `Please check your wallet in ${countdown}!`
        : countdown}
    </button>
  );
};
