"use client";

import { useZkLogin, beginZkLogin } from "use-sui-zklogin";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { registerWithZKLogin } from "@/actions/auth";

const providersConfig = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId:
      "734503948923-el3fb7js9fi9k7m38o49p9r7mi2igp39.apps.googleusercontent.com",
  },
};

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

const formatBalance = (balanceMist) => {
  if (!balanceMist || balanceMist === "Error") return balanceMist;
  const balanceSui = parseInt(balanceMist) / 1000000;
  return balanceSui.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

const shortenAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
};

export default function ZKLogin() {
  const [mounted, setMounted] = useState(false);
  const [localAccounts, setLocalAccounts] = useState(null);
  const [localAddress, setLocalAddress] = useState(null);
  const [localIsLoaded, setLocalIsLoaded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const { isLoaded, address, accounts } = useZkLogin({
    urlZkProver: "https://prover-dev.mystenlabs.com/v1",
    generateSalt: async () => {
      return { salt: window.crypto.getRandomValues(new Uint32Array(1))[0] };
    },
  });

  const [balance, setBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalIsLoaded(isLoaded);
    setLocalAddress(address);
    setLocalAccounts(accounts);

    if (isLoaded && address && accounts?.[0]?.sub && !registrationCompleted) {
      handleRegistration(address, accounts[0].sub);
    }
  }, [isLoaded, address, accounts, registrationCompleted]);

  const handleRegistration = async (walletAddress, zksub) => {
    setIsRegistering(true);
    try {
      const result = await registerWithZKLogin(zksub, walletAddress);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setRegistrationCompleted(true);
        if (pathname === "/") {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register user");
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    if (localAddress && pathname === "/" && registrationCompleted) {
      router.push("/dashboard");
    }
  }, [localAddress, pathname, registrationCompleted]);

  useEffect(() => {
    if (!mounted || !localAddress) return;

    const fetchBalance = async () => {
      setIsLoadingBalance(true);
      try {
        const balanceData = await suiClient.getBalance({
          owner: localAddress,
        });
        setBalance(balanceData.totalBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [localAddress, mounted]);

  const handleZkLogin = async (provider) => {
    setIsLoggingIn(true);
    try {
      await beginZkLogin({
        suiClient,
        provider,
        providersConfig,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleClearState = () => {
    localStorage.removeItem("zklogin.accounts");
    setLocalAddress(null);
    setLocalAccounts(null);
    setBalance(null);
    setRegistrationCompleted(false);
    window.location.href = "/";
  };

  const handleCopyAddress = async () => {
    if (localAddress) {
      try {
        await navigator.clipboard.writeText(localAddress);
        toast.success("Address copied!");
      } catch (error) {
        console.error("Copy failed:", error);
        toast.error("Failed to copy address");
      }
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <button disabled className="px-4 py-2 bg-gray-400 text-white rounded">
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!localAddress ? (
        <button
          onClick={() => handleZkLogin("google")}
          disabled={isLoggingIn || !localIsLoaded || isRegistering}
          className="bg-black text-white flex align-center justify-center rounded-md py-2 px-4 font-medium border border-white transition duration-300 text-center cursor-pointer"
        >
          {isLoggingIn
            ? "Logging in..."
            : isRegistering
            ? "Setting up account..."
            : localIsLoaded
            ? "ZKLogin"
            : "Loading..."}
        </button>
      ) : (
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleCopyAddress}
                className="bg-black px-3 py-1 rounded text-sm cursor-pointer"
              >
                {shortenAddress(localAddress)}
              </button>
              <p className="text-sm">
                {isLoadingBalance
                  ? "Loading..."
                  : balance === "Error"
                  ? "Error fetching balance"
                  : `${formatBalance(balance)} SUI`}
              </p>
              <button
                onClick={handleClearState}
                className="bg-white border border-black px-3 py-1 text-sm rounded cursor-pointer transition text-black"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
