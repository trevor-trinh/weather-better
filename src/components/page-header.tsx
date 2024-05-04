"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import WalletConnect from "@/components/WalletConnect";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SupportDialog from "@/components/SupportDialog";
import UnlimitButton from "./UnlimitButton";

export default function PageHeader() {
  const [weatherIcon, setWeatherIcon] = useState("🌦️");
  const weatherIcons = ["🌦️", "🌧️", "☀️", "👓"];

  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);

  const startCyclingIcons = () => {
    intervalRef.current = setInterval(() => {
      setWeatherIcon((prevIcon) => {
        const currentIndex = weatherIcons.indexOf(prevIcon);
        const nextIndex = (currentIndex + 1) % weatherIcons.length;
        return weatherIcons[nextIndex];
      });
    }, 50);
  };

  const stopCyclingIcons = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-inherit">
      <header className="flex justify-between items-center w-full px-8 py-2">
        <nav className="flex gap-8 items-center">
          <Link
            onMouseEnter={startCyclingIcons}
            onMouseLeave={stopCyclingIcons}
            className="items-center font-bold text-lg hover:text-indigo-500 transition-colors"
            href="/"
          >
            {weatherIcon} WeatherBetter
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hover:text-indigo-500"
            href="/"
          >
            Home
          </Link>

          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hover:text-indigo-500"
            href="/bet"
          >
            Bet
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 hover:text-indigo-500"
                href={""}
              >
                Support
              </Link>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <SupportDialog />
            </DialogContent>
          </Dialog>
        </nav>

        <div className="flex gap-2 items-center">
          <UnlimitButton />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>
      <Separator className="bg-indigo-500" />
    </div>
  );
}
