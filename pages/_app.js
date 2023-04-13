import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  bsc,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
const { chains, provider } = configureChains(
  [
    mainnet,
    bsc,
    // polygon, optimism, arbitrum,
    goerli,
  ],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    alchemyProvider({ apiKey: "tRdeeyR7ArxgvGJg165ytbOIm3QD" }),
    jsonRpcProvider({
      rpc: (chain) => ({
        // http: `https://${chain.id}.example.com`,
        http: `https://silent-warmhearted-dream.bsc.discover.quiknode.pro/7ff8e19d4bdb698db0bb001bc2485ec3795a5c90/`,
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
