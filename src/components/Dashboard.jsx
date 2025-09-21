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
    },
  },
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

        const month = parseInt(dateParts[1]) - 1; // Convert to 0-11 index
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
          borderColor: "#000",
          borderDash: [5, 5],
          backgroundColor: "rgba(0,0,0,0.05)",
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
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
      : "ETH"; // Default token
  };

  const paymentToken = getPaymentToken();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-20 mb-10 px-4">
      <div className="space-y-10 max-w-[90%] w-full ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
            <span className="text-[14px] font-[400]">Monthly Revenue</span>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[30px] font-[500]">
                {monthlyRevenue.toLocaleString()}
                <span className="text-[14px] ml-1">{paymentToken}</span>
              </span>
              <span className="text-[14px] font-[400] flex items-center gap-2">
                <span>-0.03%</span>
                <img src="Vector(3).png" alt="change-icon" />
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
            <span className="text-[14px] font-[400]">Monthly Gigs</span>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[30px] font-[500]">{monthlyGigs}</span>
              <span className="text-[14px] font-[400] flex items-center gap-2">
                <span>10%</span>
                <img src="Vector(3).png" alt="change-icon" />
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
            <span className="text-[14px] font-[400]">Total Gigs</span>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[30px] font-[500]">{totalGigs}</span>
              <span className="text-[14px] font-[400] flex items-center gap-2">
                <span>10%</span>
                <img src="Vector(3).png" alt="change-icon" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full">
          <div className="text-2xl font-semibold text-left">Revenue Chart</div>

          <div className="w-full h-[400px]">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
