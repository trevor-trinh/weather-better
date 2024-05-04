import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";
import "./globals.css";
import PageHeader from "@/components/page-header";
import { ThemeProvider } from "@/components/theme-provider";
import PageFooter from "@/components/page-footer";
import ThirdwebProvider from "@/components/thirdweb-provder";
import { Toaster } from "@/components/ui/toaster";

const londrina = Londrina_Solid({ weight: "300", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeatherBetter",
  description: "WeatherBetter for eth sydney 2024, by THUBA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requiredEnv = [
    "NEXT_PUBLIC_THIRDWEB_CLIENT_ID",
    "THIRDWEB_SECRET_KEY",
    "NEXT_PUBLIC_WEATHER_API",
    "NEXT_PUBLIC_WLD_APP_ID",
    "NEXT_PUBLIC_WLD_CREATE_ACTION",
    "NEXT_PUBLIC_WLD_BET_ACTION",
    "SECRET_KEY",
    "API_KEY",
  ];

  requiredEnv.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`Missing required ENV variable: ${env}`);
    }
  });

  return (
    <html lang="en">
      <body className={londrina.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <Toaster />
            <PageHeader />
            <main className="flex min-h-screen flex-col items-center px-16 py-8">
              {children}
            </main>
            <PageFooter />
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
