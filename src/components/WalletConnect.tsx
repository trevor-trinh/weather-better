"use client";

import { useTheme } from "next-themes";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
  createWallet("me.rainbow"),
  createWallet("app.phantom"),
];

export default function WalletConnect() {
  const { theme } = useTheme();

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={theme as "dark" | "light"}
      connectModal={{
        size: "wide",
        showThirdwebBranding: false,
      }}
    />
  );
}
