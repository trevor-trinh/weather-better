"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, weatherIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { WeatherTypes } from "@/lib/types";
import { SetStateAction, useEffect, useState } from "react";

import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  useIDKit,
} from "@worldcoin/idkit";
import { useRouter } from "next/navigation";
import verifyWorldId from "@/lib/verifyWorldId";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "@/lib/fujiAbi";
import { config } from "@/lib/config";
import { writeContract } from "@wagmi/core";

const weatherTypes = ["Sunny", "Rainy", "Cloudy", "Snowy"] as const;
const cities = [
  { label: "Beijing, China", value: "beijing" },
  { label: "Berkeley, USA", value: "berkeley" },
  { label: "Sydney, Australia", value: "sydney" },
] as const;

const FormSchema = z.object({
  location: z.string({ required_error: "A location is required." }),
  date: z.date({
    required_error: "A date of bet is required.",
  }),
  weather: z.enum(weatherTypes, {
    required_error: "A weather type is required",
  }),
  betAmount: z
    .number()
    .min(1, {
      message: "Bet amount must be at least 1 usdc",
    })
    .max(69, {
      message: "Bet amount can be at most 69 usdc",
    })
    .default(0),
});

export default function BetForm({
  setPreviewData,
}: {
  setPreviewData: SetStateAction<any>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { toast } = useToast();
  const { setOpen } = useIDKit();
  const router = useRouter();
  const account = useAccount();

  const watchedFields = form.watch(["date", "location", "weather"]);

  useEffect(() => {
    setPreviewData(watchedFields[0] + watchedFields[1] + watchedFields[2]);
  }, [watchedFields, setPreviewData]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setOpen(true);

    toast({
      title: "You are submitting the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

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
        process.env.NEXT_PUBLIC_WLD_CREATE_ACTION as string
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

  //   uint256 _pool_ID, // 测试从100开始
  //         string calldata _location,
  //         string calldata _day_time,
  //         uint256 _weather, // 假设这里传递的是weathers枚举的整数索引
  //         address _owner_address,
  //         address _token_address

  const fujiContract = "0xaC161c23B20d59942c1487fB6CAfeDA35FCa4Ed3";
  const fujiUsdc = "0x5425890298aed601595a70AB815c96711a31Bc65";

  // const { writeContract } = useWriteContract();

  const handleWeb3 = async () => {
    // await wallet.connect();
    console.log("HANDLING WEB3");

    const poolId =
      parseInt(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    const location = form.getValues("location");
    const dayTime = format(form.getValues("date"), "PPP");
    const weather = weatherTypes.indexOf(form.getValues("weather"));
    const ownerAddress = account.address;
    const tokenAddress = fujiUsdc;

    // create pool fuji contract
    const result = await writeContract(config, {
      abi,
      address: fujiContract,
      functionName: "createPool",
      args: [
        BigInt(poolId),
        location,
        dayTime,
        BigInt(weather),
        ownerAddress,
        tokenAddress,
      ],
    });

    // writeContract({
    //   abi: fujiAbi,
    //   address: fujiContract,
    //   functionName: "createPool",
    // args: [
    //   BigInt(poolId),
    //   location,
    //   dayTime,
    //   BigInt(weather),
    //   ownerAddress,
    //   tokenAddress,
    // ],
    // });

    console.log("SUCCESS");
  };

  return (
    <>
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_WLD_CREATE_ACTION!}
        verification_level={VerificationLevel.Device}
        onSuccess={onSuccess}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Location</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? cities.find(
                              (cities) => cities.value === field.value
                            )?.label
                          : "Select Location"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search location..." />
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            value={city.label}
                            key={city.value}
                            onSelect={() => {
                              form.setValue("location", city.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                city.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {city.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a bet date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weather"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Weather</FormLabel>
                <div className="flex flex-row justify-start gap-2">
                  {weatherTypes.map((weather) => (
                    <FormControl key={weather}>
                      <Button
                        type="button"
                        role="radio"
                        className={`text-xs py-2 mx-1 my-1 ${
                          form.getValues("weather") === weather
                            ? "bg-indigo-500 hover:bg-indigo-400 text-white hover:text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-black hover:text-black"
                        }`}
                        onClick={() => {
                          field.onChange(weather);
                        }}
                        variant="outline"
                      >
                        {weatherIcon(weather as WeatherTypes)} {weather}
                      </Button>
                    </FormControl>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="betAmount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-5 gap-4">
                    <Slider
                      min={0}
                      max={69}
                      step={0.001}
                      defaultValue={[0]}
                      onValueChange={(vals) => {
                        field.onChange(vals[0]);
                      }}
                      value={[form.getValues("betAmount")]}
                      className="col-span-4"
                    />

                    <Input
                      className="col-span-1"
                      type="number"
                      value={form.getValues("betAmount")}
                      max={69}
                      step={0.001}
                      onChange={(event) => field.onChange(+event.target.value)}
                      defaultValue={0}
                    />
                  </div>
                </FormControl>
                <FormDescription>{field.value} usdc</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
