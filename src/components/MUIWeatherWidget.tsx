import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const API_OPTIONS = "units=metric&exclude=minutely,alerts&";
const iconBaseUrl = "http://openweathermap.org/img/wn/";
const iconFormat = ".png";

export default function MUIWeatherWidget({ city }) {
  const QUERY_URL = "https://api.openweathermap.org/data/2.5/onecall?";
  const LAT = `lat=${city.coords[0]}&`;
  const LON = `lon=${city.coords[1]}&`;
  const API_KEY = `appid=${process.env.NEXT_PUBLIC_WEATHER_API}`;
  const FILE = QUERY_URL + LAT + LON + API_OPTIONS + API_KEY;

  const [data, setData] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [temp, setTemp] = useState(undefined);
  const [pressure, setPressure] = useState(undefined);
  const [humidity, setHumidity] = useState(undefined);
  const [bgGif, setBGGif] = useState(undefined);

  const iconsFullyUrl = useMemo(
    () => ({
      today: iconBaseUrl + data?.current.weather[0].icon + iconFormat,
      tomorrow: iconBaseUrl + data?.daily[0].weather[0].icon + iconFormat,
      "day after tomorrow":
        iconBaseUrl + data?.daily[1].weather[0].icon + iconFormat,
      now: iconBaseUrl + data?.daily[1].weather[0].icon + iconFormat,
      plus1: iconBaseUrl + data?.hourly[1].weather[0].icon + iconFormat,
      plus2: iconBaseUrl + data?.hourly[2].weather[0].icon + iconFormat,
      plus3: iconBaseUrl + data?.hourly[3].weather[0].icon + iconFormat,
      plus4: iconBaseUrl + data?.hourly[4].weather[0].icon + iconFormat,
      plus5: iconBaseUrl + data?.hourly[5].weather[0].icon + iconFormat,
    }),
    [data]
  );

  useEffect(() => {
    fetch(FILE)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setDescription(data.current.weather[0].description);
        setTemp(Math.round(data.current.temp));
        setPressure(data.current.pressure);
        setHumidity(data.current.humidity);

        const main = data.current.weather[0].main;
        const bgImages = {
          Snow: "/weathers/snow.gif",
          Clouds: "/weathers/clouds.gif",
          Fog: "/weathers/fog.gif",
          Rain: "/weathers/rain.gif",
          Clear: "/weathers/clear.gif",
          Thunderstorm: "/weathers/thunderstorm.gif",
        };
        setBGGif(bgImages[main] || "/weathers/clear.gif");
      });
  }, [FILE]);

  return (
    <div>
      <div
        className="flex items-center justify-center bg-cover rounded-lg"
        style={{ backgroundImage: `url(${bgGif})` }}
      >
        <div className="bg-black/50 p-4 rounded-lg shadow-xl text-white max-w-2xl w-full">
          <div className="text-center mb-3">
            <h1 className="text-4xl mb-2">{city.name}</h1>
            <p className="mb-1">{description}</p>
            <p className="text-6xl mb-1">{temp}°C</p>
            <div className="mb-2">
              Pressure: {pressure} | Humidity: {humidity}%
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 mb-4 text-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative">
                <strong>
                  {i === 0 ? "Now" : `${new Date().getHours() + (i % 24)}:00`}
                </strong>
                <Image
                  src={
                    i === 0 ? iconsFullyUrl["now"] : iconsFullyUrl[`plus${i}`]
                  }
                  width={30}
                  height={30}
                  alt="weather icon"
                  className="mx-auto"
                />
                <strong>{data?.hourly[i]?.temp}°</strong>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {["Today", "Tomorrow", "Day after tomorrow"].map(
              (period, index) => (
                <div key={index} className="flex justify-between items-center">
                  <strong>{period}</strong>
                  <div className="flex flex-row items-center">
                    <Image
                      src={iconsFullyUrl[period.toLowerCase()]}
                      alt="daily weather"
                      width={30}
                      height={30}
                    />
                    <strong>{Math.round(data?.daily[index]?.temp.day)}°</strong>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
