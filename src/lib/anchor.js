import { useMemo } from "react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { IDL } from "./idl.js"; // Make sure this file exists in the same directory

// Double-check this program ID - it might be incorrect
export const programId = new PublicKey("31o5zHZub2EKruR7pZRnSXv7wDp8p4CqcbjA3yQFA7nD");

export const useLpProgram = () => {
  const wallet = useAnchorWallet();
  const connection = useMemo(() => new Connection(clusterApiUrl("devnet"), "confirmed"), []);

  console.log("🧩 useLpProgram hook initialized");
  console.log("Wallet:", wallet?.publicKey?.toBase58() || "❌ No wallet connected");
  console.log("Program ID:", programId?.toBase58());

  const provider = useMemo(() => {
    if (!wallet) {
      console.warn("⚠️ No wallet yet, provider not created");
      return null;
    }

    try {
      const providerInstance = new AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
      });
      console.log("✅ Provider created successfully");
      return providerInstance;
    } catch (error) {
      console.error("❌ Error creating provider:", error);
      return null;
    }
  }, [wallet, connection]);

  const program = useMemo(() => {
    if (!provider) {
      console.warn("⚠️ No provider yet, program not initialized");
      return null;
    }

    try {
      console.log("🔄 Creating program instance...");
      console.log("IDL:", IDL);
      console.log("Program ID:", programId.toBase58());
      
      const instance = new Program(IDL, programId, provider);
      console.log("✅ Program instance created successfully");
      return instance;
    } catch (error) {
      console.error("❌ Error initializing program:", error);
      console.error("Error details:", error.message);
      return null;
    }
  }, [provider]);

  return { program, provider, wallet };
};