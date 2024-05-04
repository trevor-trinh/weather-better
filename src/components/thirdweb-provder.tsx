"use client";

import {
  ThirdwebProvider as Provider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";

export default function ThirdwebProvider({ children }: any) {
  return (
    <Provider
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
      ]}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={43113}
    >
      {children}
    </Provider>
  );
}
