"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../../lib/lp_program.json";
import { LpProgram } from "../../lib/lp_program";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

export default function BrowseGigs() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const router = useRouter();

  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  // Fetch all job posts
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
      console.log("Fetched data",gigsData);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [connected]);

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
        <h1 className="text-3xl font-bold mb-6">Browse Gigs</h1>

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
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {gig.description}
                </p>

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
                  <button
                    onClick={() => router.push(`/gig/${gig.id}`)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/apply/${gig.id}`)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
