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

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [gigs, setGigs] = useState([]);

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
        console.error("Error loading gig data:", error);
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