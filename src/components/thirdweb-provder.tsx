"use client";

import { ThirdwebProvider as Provider } from "thirdweb/react";

export default function ThirdwebProvider({ children }: any) {
  return <Provider>{children}</Provider>;
}
