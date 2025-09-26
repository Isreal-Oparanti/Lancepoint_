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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const DashboardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      
      <div className="relative">
       
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-purple-600 rounded-full"></div>
        </div>
        
     
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>

    
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">
          Loading Your Dashboard
          <span className="animate-pulse">...</span>
        </h3>
        <p className="text-gray-600 text-sm animate-fade-in-up">
          Fetching your latest gigs and analytics
        </p>
      </div>

    
      <div className="w-64 space-y-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-loading-bar"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-loading-bar-delayed"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes loading-bar-delayed {
          0% {
            width: 0%;
          }
          30% {
            width: 0%;
          }
          80% {
            width: 60%;
          }
          100% {
            width: 85%;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-loading-bar-delayed {
          animation: loading-bar-delayed 2.5s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("shortWalletAddress");
      setWallet(address);
    }
  }, []);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await fetch("/api/new-gig");
        if (!response.ok) throw new Error("Failed to fetch gig data");
        const data = await response.json();
        setGigs(data);
      } catch (error) {
        // toast.error(`Error loading gig data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGigData();
  }, [wallet]);

  const userGigs = gigs.filter((gig) => gig.userId === wallet);

  const calculateMonthlyRevenue = () => {
    const monthlyRevenue = Array(12).fill(0);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    userGigs.forEach((gig) => {
      if (!gig.payment?.amount || !gig.startDate) return;

      try {
        const dateParts = gig.startDate.split("-");
        if (dateParts.length < 3) return;

        const month = parseInt(dateParts[1]) - 1;
        if (month < 0 || month > 11) return;

        const amount = parseFloat(gig.payment.amount) || 0;
        monthlyRevenue[month] += amount;
      } catch (e) {
        console.error("Error processing gig date:", e);
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Revenue",
          data: monthlyRevenue,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 3,
        },
      ],
    };
  };

  const chartData = calculateMonthlyRevenue();

  const currentMonth = new Date().getMonth();
  const monthlyRevenue = chartData.datasets[0].data[currentMonth] || 0;
  const monthlyGigs = userGigs.filter((gig) => {
    if (!gig.startDate) return false;
    try {
      const gigMonth = parseInt(gig.startDate.split("-")[1]) - 1;
      return gigMonth === currentMonth;
    } catch {
      return false;
    }
  }).length;
  const totalGigs = userGigs.length;

  // Get the most common token used in payments
  const getPaymentToken = () => {
    const tokenCounts = {};
    userGigs.forEach((gig) => {
      if (gig.payment?.token) {
        tokenCounts[gig.payment.token] =
          (tokenCounts[gig.payment.token] || 0) + 1;
      }
    });
    const tokens = Object.keys(tokenCounts);
    return tokens.length > 0
      ? tokens.reduce((a, b) => (tokenCounts[a] > tokenCounts[b] ? a : b))
      : "SOL";
  };

  const paymentToken = getPaymentToken();

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64 pb-16 lg:pb-0">
          <div className="min-h-screen flex items-center justify-center">
            <DashboardLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      
      <div className="flex-1 lg:ml-64 pb-16 lg:pb-0">
        <div className="p-4 lg:p-8 min-h-screen">
          
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your gigs.</p>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +2.5%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">
                {monthlyRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">{paymentToken}</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +12%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Gigs</h3>
              <p className="text-2xl font-bold text-gray-900">{monthlyGigs}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +8%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Gigs</h3>
              <p className="text-2xl font-bold text-gray-900">{totalGigs}</p>
            </div>
          </div>

       
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-gray-600 text-sm mt-1">Your earnings throughout the year</p>
            </div>
            
            <div className="h-96">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}