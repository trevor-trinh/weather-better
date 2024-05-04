export const dynamic = "force-dynamic";

const verifyEndpoint = `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export async function POST(request: Request) {
  const data = await request.json();
  console.log("data from frontend", JSON.stringify(data, null, 2));

  const verifyRes = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const wldResponse = await verifyRes.json();

  console.log(
    `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
    wldResponse
  );

  if (verifyRes.status == 200) {
    return Response.json(
      { code: "success", detail: wldResponse },
      { status: 200 }
    );
  } else {
    return Response.json(
      { code: wldResponse.code, detail: wldResponse.detail },
      { status: 400 }
    );
  }
}
