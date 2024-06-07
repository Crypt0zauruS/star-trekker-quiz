import "@/styles/globals.css";
import "@/styles/app.css";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polygon } from "wagmi/chains";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { MetamaskProvider } from "../Provider";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";
import Head from "next/head";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      const res = await fetch("/api/config", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const wagmiConfig = getDefaultConfig({
        appName: "Star Trekker Quiz",
        projectId: data.wcProjectId || "", // Provide a default value for WC_PROJECT_ID
        chains: [polygon],
        ssr: true,
        transports: {
          [polygon.id]: http(data.polygonApiKey || ""),
        },
      });

      setConfig(wagmiConfig as any);
    }

    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} locale="en">
          <MetamaskProvider>
            <IconContext.Provider
              value={{ style: { verticalAlign: "middle" } }}
            >
              <Head>
                <meta charSet="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <meta
                  name="description"
                  content="Whitelist dApp for the Star Trekker NFT Free Mint"
                />
                <meta name="author" content="Crypt0zauruS" />
                <link rel="icon" href="/st.png" />
                <title>Star Trekker Quizz !</title>
              </Head>
              <Component {...pageProps} config={config} />
            </IconContext.Provider>
          </MetamaskProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
