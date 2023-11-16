"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import {
  SIWEProvider,
  SIWEConfig,
  ConnectKitProvider,
  getDefaultConfig,
  SIWESession,
} from "connectkit";
import { SiweMessage } from "siwe";

const inter = Inter({ subsets: ["latin"] });

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: alchemyId, // or infuraId
    walletConnectProjectId: walletConnectProjectId,

    // Required
    appName: "SIWE-example-frontend",

    // Optional
    appDescription: "SIWE example frontend",
    appUrl: "http://localhost:3000/", // your app's url
    appIcon: "",
  })
);

const nowTime = new Date(Date.now());
const expiredTime = new Date(Date.now() + 10 * 60 * 1000); // 簽名過期時間 10 minutes

const siweConfig: SIWEConfig = {
  getNonce: async () => Math.floor(Date.now()).toString(),
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: "Sign in With Ethereum.",
      issuedAt: nowTime.toISOString(),
      expirationTime: expiredTime.toISOString(),
    }).prepareMessage();
  },

  verifyMessage: async ({ message, signature }) => {
    console.log(" message: ", message);
    console.log(" signature: ", signature);
    localStorage.setItem("message", JSON.stringify(message));
    // call backend authentication api to verify a signed message,
    // and you should get jwt when verifying success,
    // then store to cookie or localStorage and return true.
    // if verify fails, return false.
    return true;
  },

  getSession: async () => {
    // TODO: get "session" from cookie or localStorage,
    // if get "session" return session object, else return null.
    const fakeSession: SIWESession = { address: "", chainId: 1 };
    return fakeSession;
  },
  signOut: async () => {
    // TODO: clean jwt from cookie or localStorage, then return true.
    return true;
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <SIWEProvider {...siweConfig}>
            <ConnectKitProvider>{children}</ConnectKitProvider>
          </SIWEProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
