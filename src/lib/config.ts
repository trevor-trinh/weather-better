import { http, createConfig, configureChains } from "wagmi";
import { sepolia, avalancheFuji } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { abi as fujiAbi } from "@/lib/fujiAbi";

export const config = createConfig({
  chains: [avalancheFuji, sepolia],
  connectors: [metaMask()],
  transports: {
    [avalancheFuji.id]: http(),
    [sepolia.id]: http(),
  },
  // contracts: {
  //   [avalancheFuji.id]: {
  //     fujiAbi: {
  //       address: "0xaC161c23B20d59942c1487fB6CAfeDA35FCa4Ed3",
  //       abi: [],
  //     },
  //   },
  // },
});
