import { useState } from "react";

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
import { cities, weatherIcon } from "@/lib/utils";
import MUIWeatherWidget from "@/components/MUIWeatherWidget";
import { useActiveAccount } from "thirdweb/react";
import { useToast } from "@/components/ui/use-toast";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  useIDKit,
} from "@worldcoin/idkit";
import verifyWorldId from "@/lib/verifyWorldId";
import { useAddress } from "@thirdweb-dev/react";

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
  const address = useAddress();
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

    if (!address) {
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
      userAddress: address,
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
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-400"
          onClick={handleSubmit}
        >
          BET
        </Button>
      </DialogFooter>
    </>
  );
}
