import { WeatherBet } from "@/lib/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { weatherIcon } from "@/lib/utils";
import BetDialog from "@/components/BetDialog";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  useIDKit,
} from "@worldcoin/idkit";
import verifyWorldId from "@/lib/verifyWorldId";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function BetCard(wBet: WeatherBet) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setOpen } = useIDKit();
  const { toast } = useToast();

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
        // TODO: TRIGGER METAMASK TRANSACTION
        // router.push("/");
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

  return (
    <>
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_WLD_BET_ACTION!}
        verification_level={VerificationLevel.Device}
        onSuccess={onSuccess}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Card className="w-full rounded-lg overflow-hidden shadow-md hover:shadow-indigo-500 duration-150 hover:cursor-pointer">
            <div className="flex flex-row items-center px-4 justify-between">
              <div className="w-1/3 h-full flex items-center">
                <Image
                  src={`https://api.cloudnouns.com/v1/pfp?text=thuba----------------------${
                    wBet.date + wBet.location + wBet.weather
                  }`}
                  className="object-contain"
                  alt="noun"
                  layout="responsive"
                  width={200}
                  height={200}
                />
              </div>
              <div className="w-2/3">
                <CardHeader className="pr-2">
                  <CardTitle className="text-lg font-bold truncate overflow-hidden break-all">
                    {wBet.location}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {wBet.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pr-2 pb-2">
                  <div className="self-center animate-bounce">
                    <p>
                      {weatherIcon(wBet.weather)} {wBet.weather}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-green-500">{`$${wBet.totalPool.toLocaleString()}`}</p>
                    </div>
                    <Progress value={wBet.betRatio} className="h-2" />
                    <div className="flex flex-row justify-between">
                      <p className="text-md text-gray-500">{`${wBet.betRatio}%`}</p>
                      <p className="text-md text-gray-500">{`${
                        100 - wBet.betRatio
                      }%`}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pr-2">
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-400">
                    Bet
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="w-full">
          <BetDialog
            wBet={wBet}
            setOpen={setOpen}
            setDialogOpen={setDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
