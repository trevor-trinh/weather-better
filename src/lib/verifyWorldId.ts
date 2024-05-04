import { ISuccessResult } from "@worldcoin/idkit";
import { VerifyReply } from "@/lib/types";

export default async function verifyWorldId(
  result: ISuccessResult,
  action: string
): Promise<VerifyReply> {
  console.log("Sending to backend...", result);

  const res: Response = await fetch("/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...result,
      action: action,
    }),
  });

  const data: VerifyReply = await res.json();

  if (res.status == 200) {
    console.log("Verified World ID Proof!", data);
    return { code: "success", detail: data.detail };
  } else {
    console.log("Failed to verify!", data);
    return { code: "error", detail: data.detail };
  }
}
