import { http, createConfig } from "wagmi";
import { sepolia, avalancheFuji } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [avalancheFuji, sepolia],
  connectors: [metaMask()],
  transports: {
    [avalancheFuji.id]: http(),
    [sepolia.id]: http(),
  },
});
