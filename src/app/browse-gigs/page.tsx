"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../lib/lp_program.json";
import { LpProgram } from "../../lib/lp_program";
import toast from "react-hot-toast";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

export default function BrowseGigs() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [expectedEndDate, setExpectedEndDate] = useState("");

  const getProvider = () => {
    if (!connection) throw new Error("No connection");
    const provider = new AnchorProvider(
      connection,
      { publicKey, signTransaction } as any,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  // Fetch job posts
  const fetchGigs = async () => {
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl_object, provider);
      const jobPosts = await program.account.jobPost.all();

      const gigsData = jobPosts.map((job: any) => ({
        id: job.publicKey.toString(),
        title: job.account.title,
        description: job.account.description,
        amount: job.account.amount.toNumber() / web3.LAMPORTS_PER_SOL,
        client: job.account.client.toString(),
        startDate: new Date(job.account.startDate.toNumber() * 1000).toLocaleString(),
        endDate: new Date(job.account.endDate.toNumber() * 1000).toLocaleString(),
      }));

      setGigs(gigsData);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) fetchGigs();
  }, [connected]);

  // Apply for a gig
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!resumeLink.trim() || !expectedEndDate) {
      toast.error("All fields are required");
      return;
    }

    setIsApplying(true);

    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl_object, provider);
      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const jobPostPubkey = new PublicKey(selectedGig.id);
      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          jobPostPubkey.toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const expectedEndTimestamp = new BN(
        Math.floor(new Date(expectedEndDate).getTime() / 1000)
      );

      console.log("📝 Applying with details:", {
        jobPostPubkey: jobPostPubkey.toString(),
        applicationPda: applicationPda.toString(),
        resumeLink,
        expectedEndTimestamp: expectedEndTimestamp.toString(),
      });

      // Build a fresh transaction
      const tx = await program.methods
        .applyToJob(resumeLink, expectedEndTimestamp)
        .accounts({
          application: applicationPda,
          freelancer: provider.wallet.publicKey,
          jobPost: jobPostPubkey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .transaction();

      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

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
                ✅ Application Submitted Successfully
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

      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      // Reset form + close modal
      setResumeLink("");
      setExpectedEndDate("");
      setShowModal(false);
    } catch (error: any) {
      console.error("❌ Error applying:", error);

      if (error?.signature) {
        console.log("Transaction hash:", error.signature);
        toast.success(`Transaction processed: ${error.signature}`);
        return;
      }

      if (error.message?.includes("already been processed")) {
        toast("Transaction already processed, Kindly check your applications");
        return;
      }

      let message = error.message || "Transaction failed";
      if (error.logs) {
        const logMsg = error.logs.find((log: string) => log.includes("Error Message:"));
        if (logMsg) message = logMsg.split("Error Message: ")[1];
      }

      toast.error("Unable to apply for Gig at the Moment");
      console.log(message);
    } finally {
      setIsApplying(false);
    }
  };



  const filteredGigs =
    filter === "all" ? gigs : gigs.filter((gig) => gig.title.includes(filter));

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-300 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800">Loading gigs...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-10">
        <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-6">
          Discover exciting opportunities and find the perfect project for your skills
        </p>

        {gigs.length === 0 ? (
          <p className="text-gray-600">No gigs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{gig.description}</p>
                <div className="text-sm text-gray-700 mb-1">
                  💰 <b>{gig.amount}</b> SOL
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  🕒 {gig.startDate} - {gig.endDate}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  👤 Client: {gig.client.slice(0, 6)}...{gig.client.slice(-4)}
                </div>

                <div className="flex gap-3">
                  {/* <button
                    onClick={() => router.push(`/gig/${gig.id}`)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    View
                  </button> */}
                  <button
                    onClick={() => {
                      setSelectedGig(gig);
                      setShowModal(true);
                    }}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Apply for {selectedGig?.title}
            </h2>
            <form onSubmit={handleApply}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Resume / Portfolio Link
              </label>
              <input
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring focus:ring-purple-200"
                placeholder="https://..."
                required
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Expected End Date
              </label>
              <input
                type="date"
                value={expectedEndDate}
                onChange={(e) => setExpectedEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring focus:ring-purple-200"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className={`px-4 py-2 rounded-lg text-white transition cursor-pointer
    ${isApplying
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    }`}
                >
                  {isApplying ? "Submitting..." : "Submit"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
