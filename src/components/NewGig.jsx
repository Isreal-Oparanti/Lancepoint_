"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

async function fetchEthToUsdRate() {
  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
    );
    const data = await response.json();
    return data.data.rates?.USD ? parseFloat(data.data.rates.USD) : 0.5;
  } catch (error) {
    console.error("Error fetching ETH price from Coinbase:", error);
    return 0.5;
  }
}

export default function NewGig() {
  const [wallet, setWallet] = useState(null);

  console.log("Base:", wallet);

  const [formData, setFormData] = useState({
    services: [],
    jobTitle: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    payment: {
      token: "ETH",
      amount: "",
      usdAmount: 0,
    },
    milestones: [],
    userId: wallet || "",
  });
  const router = useRouter();
  const [ethRate, setEthRate] = useState(0.5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState("");
  const [currentMilestone, setCurrentMilestone] = useState({
    header: "",
    body: "",
    date: "",
  });

  useEffect(() => {
    fetchEthToUsdRate().then((rate) => setEthRate(rate));
  }, []);

  useEffect(() => {
    const address = localStorage.getItem("shortWalletAddress");

    if (address) {
      setWallet(address);
    } else {
      const randomId = [...Array(10)]
        .map(() => Math.random().toString(36)[2])
        .join("");
      setWallet(randomId);
      localStorage.setItem("shortWalletAddress", randomId);
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      setFormData((prev) => ({
        ...prev,
        userId: wallet,
      }));
    }
  }, [wallet]);

  useEffect(() => {
    const amount = parseFloat(formData.payment.amount) || 0;
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        usdAmount: parseFloat((amount * ethRate).toFixed(6)),
      },
    }));
  }, [formData.payment.amount, ethRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("payment.")) {
      const paymentField = name.split(".")[1];
      setFormData({
        ...formData,
        payment: {
          ...formData.payment,
          [paymentField]: paymentField === "amount" ? value : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleServiceAdd = () => {
    if (currentService.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, currentService.trim()],
      });
      setCurrentService("");
      toast.success("Service added successfully");
    } else {
      toast.error("Please enter a service name");
    }
  };

  const handleMilestoneAdd = () => {
    if (currentMilestone.header.trim() && currentMilestone.date) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, currentMilestone],
      });
      setCurrentMilestone({
        header: "",
        body: "",
        date: "",
      });
      toast.success("Milestone added successfully");
    } else {
      toast.error("Please fill all milestone fields");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.userId) {
      toast.error("Please connect your wallet to create a gig");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/new-gig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          payment: {
            ...formData.payment,
            amount: parseFloat(formData.payment.amount) || 0,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error creating job:", data.error);
        toast.error(
          `Failed to create job: ${data.error?.message || "Unknown error"}`
        );
        return;
      }

      toast.success("Job created successfully!");
      console.log("Job created:", data);
      router.push("/browse-gigs");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while creating the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center my-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full max-w-4xl"
      >
        <div className="text-2xl font-semibold text-left">Description</div>

        <div>
          <p className="font-medium text-[14px]">
            What talent are you looking for?
          </p>
          <input type="hidden" name="userId" value={formData.userId} />
          <div className="flex gap-2 mt-5">
            <input
              value={currentService}
              onChange={(e) => setCurrentService(e.target.value)}
              placeholder="Service name"
              className="flex-1 p-5 border border-[#ACACAC] rounded-md"
            />
            <button
              type="button"
              onClick={handleServiceAdd}
              className="bg-black text-white px-4 rounded-md font-medium cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
        {formData.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.services.map((service, index) => (
              <div
                key={index}
                className="relative group pl-3 pr-6 py-1.5 bg-black text-white text-sm rounded-md flex items-center p-5"
              >
                {service}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      services: prev.services.filter((_, i) => i !== index),
                    }));
                    toast.success("Service removed");
                  }}
                  className="absolute right-1 text-white opacity-70 hover:opacity-100 focus:outline-none p-1"
                  aria-label={`Remove ${service}`}
                >
                  <span className="block w-4 h-4 cursor-pointer">×</span>
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="font-medium text-[14px] block">Job Title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-5 border border-[#ACACAC] rounded-md mt-2"
            required
          />
        </div>

        <div>
          <label className="font-medium text-[14px] block">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Describe the job in detail"
            className="w-full p-3 h-32 rounded-md resize-none border border-[#ACACAC] mt-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-[14px] block">Start Date</label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-5 border border-[#ACACAC] rounded-md mt-2"
              required
            />
          </div>
          <div>
            <label className="font-medium text-[14px] block">End Date</label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-5 border border-[#ACACAC] rounded-md mt-2"
              required
            />
          </div>
        </div>

        <div className="text-2xl font-semibold text-left">Payment</div>
        <p className="font-medium text-[14px]">
          Specify the amount to be paid for the job
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-medium text-[14px] block">Token</label>
            <input
              name="payment.token"
              value={formData.payment.token}
              readOnly
              className="w-full p-5 border border-[#ACACAC] rounded-md mt-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="font-medium text-[14px] block">
              Amount (ETH)
            </label>
            <input
              name="payment.amount"
              type="number"
              value={formData.payment.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full p-5 border border-[#ACACAC] rounded-md mt-2"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="font-medium text-[14px] block">
              USD Equivalent
            </label>
            <input
              name="payment.usdAmount"
              type="number"
              value={formData.payment.usdAmount}
              readOnly
              className="w-full p-5 border border-[#ACACAC] rounded-md mt-2 bg-gray-100"
            />
          </div>
        </div>

        <div className="text-2xl font-semibold text-left">Milestones</div>

        <div className="space-y-4">
          <input
            value={currentMilestone.header}
            onChange={(e) =>
              setCurrentMilestone({
                ...currentMilestone,
                header: e.target.value,
              })
            }
            placeholder="Milestone Header"
            className="w-full p-5 border border-[#ACACAC] rounded-md"
          />
          <textarea
            value={currentMilestone.body}
            onChange={(e) =>
              setCurrentMilestone({ ...currentMilestone, body: e.target.value })
            }
            placeholder="Milestone Description"
            className="w-full p-3 h-32 rounded-md resize-none border border-[#ACACAC]"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={currentMilestone.date}
              onChange={(e) =>
                setCurrentMilestone({
                  ...currentMilestone,
                  date: e.target.value,
                })
              }
              placeholder="Due Date"
              className="flex-1 p-5 border border-[#ACACAC] rounded-md"
            />
            <button
              type="button"
              onClick={handleMilestoneAdd}
              className="bg-black text-white px-4 rounded-md cursor-pointer"
            >
              Add Milestone
            </button>
          </div>
        </div>

        {formData.milestones.length > 0 && (
          <div className="space-y-4">
            {formData.milestones.map((milestone, index) => (
              <div key={index} className="border p-4 rounded-md relative">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      milestones: formData.milestones.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                  ×
                </button>
                <h3 className="font-bold">{milestone.header}</h3>
                <p className="mt-1">{milestone.body}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Due: {new Date(milestone.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            className="bg-black rounded-2xl text-white py-3 px-8 text-lg font-medium disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Gig"}
          </button>
        </div>
      </form>
    </div>
  );
}
