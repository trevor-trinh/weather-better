"use client";

import { useState, useEffect } from "react";
import BetForm from "@/components/BetForm";
import Image from "next/image";
import MUIWeatherWidget from "@/components/MUIWeatherWidget";
import { cities } from "@/lib/utils";

export default function BetPage() {
  const [previewData, setPreviewData] = useState<string>();
  const [selectedCity, setSelectedCity] = useState(cities.sydney);

  useEffect(() => {
    if (previewData) {
      if (previewData.includes("beijing")) {
        setSelectedCity(cities.beijing);
      } else if (previewData.includes("sydney")) {
        setSelectedCity(cities.sydney);
      } else if (previewData.includes("berkeley")) {
        setSelectedCity(cities.berkeley);
      }
    }
  }, [previewData]);

  console.log(previewData);
  return (
    <div className="flex my-4 w-full gap-8">
      <div className="flex flex-col p-4 space-y-6 w-1/2">
        <div className="flex flex-row items-center gap-4">
          <Image
            src={`https://api.cloudnouns.com/v1/pfp?text=thuba----------------------${previewData}`}
            alt="noun"
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-bold">Create Weather Bet</h1>
        </div>

        <BetForm setPreviewData={setPreviewData} />
      </div>

      <div className="flex w-1/2 justify-center pt-8">
        {/* <MUIWeatherWidget city={selectedCity} /> */}
      </div>
    </div>
  );
}
