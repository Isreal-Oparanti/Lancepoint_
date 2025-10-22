"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils, BN, setProvider } from "@coral-xyz/anchor";
import idl from '../../lib/lp_program.json'
import { LpProgram } from '../../lib/lp_program'

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

// Form data interface
interface FormData {
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
}

async function fetchSolToUsdRate(): Promise<number> {
  try {
    const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=SOL");
    const data = await response.json();
    return parseFloat(data.data.rates?.USD || "150");
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return 150;
  }
}

export default function NewGig() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: ""
  });

  const [usdEquivalent, setUsdEquivalent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [solRate, setSolRate] = useState<number>(150);

  const getProvider = () => {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected");
    }
    const provider = new AnchorProvider(
      connection,
      { publicKey, signTransaction } as any,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  // Fetch SOL price on component mount
  useEffect(() => {
    fetchSolToUsdRate().then(rate => {
      setSolRate(rate);
    });
  }, []);

  // Update USD equivalent when amount changes
  useEffect(() => {
    if (formData.amount && !isNaN(parseFloat(formData.amount))) {
      setUsdEquivalent(parseFloat(formData.amount) * solRate);
    } else {
      setUsdEquivalent(0);
    }
  }, [formData.amount, solRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };




  const createGig = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Form validation
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please enter job title and description");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSubmitting(true);

    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl_object, provider);

      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const amountInLamports = new BN(parseFloat(formData.amount) * web3.LAMPORTS_PER_SOL);

      const now = Math.floor(Date.now() / 1000);
      const startTimestamp = new BN(
        Math.max(Math.floor(startDate.getTime() / 1000), now + 3600)
      );
      const endTimestamp = new BN(Math.floor(endDate.getTime() / 1000));
      if (endTimestamp.lte(startTimestamp)) {
        toast.error("End date must be after start date (by at least 1 hour)");
        setIsSubmitting(false);
        return;
      }


      const [jobPostPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("job_post"), provider.wallet.publicKey.toBuffer(), Buffer.from(formData.title)],
        program.programId
      );

      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), jobPostPda.toBuffer()],
        program.programId
      );

      console.log("Creating gig with details:", {
        title: formData.title,
        description: formData.description,
        amount: formData.amount,
        amountInLamports: amountInLamports.toString(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        jobPostPda: jobPostPda.toString(),
        escrowPda: escrowPda.toString(),
      });

      // Build a NEW transaction every time
      const tx = await program.methods
        .initializeJobPost(
          formData.title,
          formData.description,
          amountInLamports,
          startTimestamp,
          endTimestamp
        )
        .accounts({
          jobPost: jobPostPda,
          escrow: escrowPda,
          client: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .transaction();

      // Attach a fresh blockhash
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

      // Sign + send manually to ensure uniqueness
      const signedTx = await provider.wallet.signTransaction(tx);
      const txSig = await provider.connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      console.log("✅ Transaction sent:", txSig);
      toast.custom(
        (t) => (
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-green-200 shadow-md rounded-lg p-4 w-full max-w-[480px] ${t.visible ? "animate-enter" : "animate-leave"
              }`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-green-600 mb-1">
                ✅ Gig Created Successfully
              </div>

              <div
                className="font-mono text-xs text-gray-600 break-all bg-gray-50 rounded-md p-2 mt-1 max-h-[70px] overflow-y-auto"
                style={{ wordBreak: "break-all", userSelect: "text" }}
              >
                {txSig}
              </div>

              <a
                href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View on Explorer ↗
              </a>
            </div>

            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await navigator.clipboard.writeText(txSig);
                  toast.success("Transaction hash copied ✅");
                } catch {
                  window.prompt("Copy TX hash:", txSig);
                }
              }}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-1 whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        ),
        { duration: 5000, position: "top-right" }
      );


      // Wait for confirmation
      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
      });

    } catch (error: any) {
      console.error("❌ Error creating gig:", error);

      if (error?.signature) {
        console.log("Transaction hash:", error.signature);
        toast.success(`Transaction processed: ${error.signature}`);
        return;
      }

      if (error.message?.includes("already been processed")) {
        toast.success("Success"); return;
      }

      let message = error.message || "Transaction failed";
      if (error.logs) {
        const logMsg = error.logs.find((log: string) => log.includes("Error Message:"));
        if (logMsg) message = logMsg.split("Error Message: ")[1];
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 pb-12 lg:pb-0">
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Create a New Gig
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Post your project and find the perfect talent for your needs
              </p>
              {!connected && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <p className="text-yellow-800">
                    Please connect your wallet to create a gig
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <form onSubmit={createGig} className="space-y-6 p-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Job Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full p-4 border border-gray-300 rounded-lg disabled:opacity-50"
                    placeholder="e.g., Frontend Developer for React Project"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    disabled={isSubmitting}
                    className="w-full p-4 border border-gray-300 rounded-lg disabled:opacity-50"
                    placeholder="Describe the project requirements, skills needed, and deliverables..."
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    Amount (in SOL)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    step="0.001"
                    min="0.001"
                    className="w-full p-4 border border-gray-300 rounded-lg disabled:opacity-50"
                    placeholder="0.00"
                  />
                  {usdEquivalent > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      ≈ ${usdEquivalent.toFixed(2)} USD
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full p-4 border border-gray-300 rounded-lg disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full p-4 border border-gray-300 rounded-lg disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !connected}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Create Job Post"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>All payments are securely processed on the blockchain</p>
              <p className="mt-1">Current SOL price: ${solRate.toFixed(2)} USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}