"use client";

import { GateFiSDK, GateFiDisplayModeEnum } from "@gatefi/js-sdk";
import { useState, useRef } from "react";
import { useAddress } from "@thirdweb-dev/react";

export default function UnlimitButton() {
  const address = useAddress();
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleOnClick = () => {
    console.log("top button clicked");

    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = require("crypto").randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        isSandbox: true,
        walletAddress: address,
        email: "your@emailaddress.com",
        externalId: randomString,
        defaultFiat: {
          currency: "USD",
          amount: "64",
        },
        defaultCrypto: {
          currency: "ETH",
        },
      });
      overlayInstanceSDK.current.show();
      setIsOverlayVisible(true);
    }
  };

  return (
    <>
      <button
        onClick={handleOnClick}
        className={`mx-2 text-white font-bold py-2 px-4 rounded ${
          !address
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-400"
        }`}
        disabled={!address}
      >
        Unlimit Onramp
      </button>
      <div id="overlay-button"></div>
    </>
  );
}
