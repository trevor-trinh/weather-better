import { http, createConfig } from "wagmi";
import { baseSepolia, avalancheFuji } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [avalancheFuji, baseSepolia],
  connectors: [metaMask()],
  transports: {
    [avalancheFuji.id]: http(),
    [baseSepolia.id]: http(),
  },
});
