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
import React from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [1200, 1900, 1700, 2200, 2000, 2400],
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

// Updated chart options
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
  return (
    <div>
      <div className="flex justify-center mt-20 mb-10 px-4">
        <div className="space-y-10 max-w-[90%] w-full ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
              <span className="text-[14px] font-[400]">Monthly Revenue</span>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[30px] font-[500]">2400</span>
                <span className="text-[14px] font-[400] flex items-center gap-2">
                  <span>-0.03%</span>
                  <img src="Vector(3).png" alt="change-icon" />
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
              <span className="text-[14px] font-[400]">Monthly Gigs</span>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[30px] font-[500]">4</span>
                <span className="text-[14px] font-[400] flex items-center gap-2">
                  <span>10%</span>
                  <img src="Vector(3).png" alt="change-icon" />
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-md p-6 md:p-8 space-y-2">
              <span className="text-[14px] font-[400]">Total Gigs</span>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[30px] font-[500]">70</span>
                <span className="text-[14px] font-[400] flex items-center gap-2">
                  <span>10%</span>
                  <img src="Vector(3).png" alt="change-icon" />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full">
            <div className="text-2xl font-semibold text-left">
              Revenue Chart
            </div>

            <div className="w-full h-[400px]">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
