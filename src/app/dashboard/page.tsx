"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  AnchorProvider,
  Program,
  web3,
  setProvider,
  BN,
} from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../../lib/lp_program.json";
import { LpProgram } from "../../lib/lp_program";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: { font: { size: 13 } },
    },
  },
  scales: {
    y: { beginAtZero: true, ticks: { font: { size: 12 } } },
    x: { grid: { display: false }, ticks: { font: { size: 12 } } },
  },
};

export default function Dashboard() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      { publicKey, signTransaction } as any,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  const fetchUserStats = async () => {
    if (!connected || !publicKey) return;
    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_stats"), publicKey.toBuffer()],
        program.programId
      );

      const account = await program.account.userStats.fetch(userStatsPDA);

      const normalizedStats = {
        totalGigsPosted: account.totalGigsPosted.toNumber(),
        totalRevenueEarned:
          account.totalRevenueEarned.toNumber() / 1_000_000_000,
        monthlyGigs: account.monthlyGigs.toNumber(),
        monthlyRevenue: account.monthlyRevenue.toNumber() / 1_000_000_000,
        lastUpdatedMonth: account.lastUpdatedMonth,
      };

      console.log("Normalized Stats:", normalizedStats);
      setUserStats(normalizedStats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      toast.error("Unable to fetch your stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [connected]);

  // --- Chart setup ---
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Monthly Revenue (SOL)",
        data: Array(12)
          .fill(0)
          .map((_, i) =>
            i === userStats?.lastUpdatedMonth
              ? userStats?.monthlyRevenue || 0
              : 0
          ),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 pb-16">
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Welcome back! Here’s your on-chain performance overview.
            </p>
          </div>

          {/* --- Stats Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard
              title="Monthly Revenue"
              value={userStats ? userStats.monthlyRevenue.toFixed(2) : "0.00"}
              token="SOL"
              iconColor="bg-purple-100 text-purple-600"
            />
            <StatCard
              title="Monthly Gigs"
              value={userStats ? userStats.monthlyGigs : 0}
              iconColor="bg-green-100 text-green-600"
            />
            <StatCard
              title="Total Gigs Posted"
              value={userStats ? userStats.totalGigsPosted : 0}
              iconColor="bg-indigo-100 text-indigo-600"
            />
            <StatCard
              title="Total Earnings"
              value={userStats ? userStats.totalRevenueEarned.toFixed(2) : "0.00"}
              token="SOL"
              iconColor="bg-blue-100 text-blue-600"
            />
          </div>

          {/* --- Revenue Chart --- */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="mb-4 sm:mb-6 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Monthly Revenue Overview
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your earnings trend throughout the year
              </p>
            </div>
            <div className="h-64 sm:h-80 lg:h-96">
              {loading ? (
                <p className="text-gray-500 text-center mt-24">
                  Loading chart...
                </p>
              ) : (
                <Line data={chartData} options={options} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Stat Card ---
function StatCard({ title, value, token, iconColor }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
        {title}
      </h3>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">
        {value}{" "}
        {token && (
          <span className="text-sm font-normal text-gray-500">{token}</span>
        )}
      </p>
    </div>
  );
}
