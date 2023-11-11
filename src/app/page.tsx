"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ethers, JsonRpcSigner } from "ethers";
import { SiweMessage } from "siwe";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function SginInWithEthereum() {
    if (!signer) return;
    const domain = window.location.host;
    const origin = window.location.origin;

    const message = new SiweMessage({
      domain,
      address: signer.address,
      statement: "Sign in with Ethereum to the app.",
      uri: origin,
      version: "1",
      chainId: 1,
    });
    const signedMessage = await signer.signMessage(message.prepareMessage());
    console.log(" signedMessage: ", signedMessage);
    // TODO : call authentication backend api
  }

  if (!hasMetamask) {
    return (
      <main className="flex items-center justify-center h-screen">
        <h1>
          請先安裝
          <a
            className=" text-blue-600 hover:cursor-pointer"
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          >
            <b> Metamask</b>
          </a>
        </h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {isConnected && (
        <Button variant="secondary" onClick={() => SginInWithEthereum()}>
          Sign Message
        </Button>
      )}
      {!isConnected && (
        <Button size="sm" variant="secondary" onClick={() => connect()}>
          Connect Wallet
        </Button>
      )}
    </main>
  );
}
