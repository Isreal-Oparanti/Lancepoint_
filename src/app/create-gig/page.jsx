"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

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
  const [ethRate, setEthRate] = useState(0.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    services: [],
    jobTitle: "",
    jobDescription: "",
    payment: {
      token: "ETH",
      amount: "",
      usdAmount: 0,
    },
    userId: wallet || "",
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

  // Text editor functions
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const handleDescriptionChange = () => {
    const editor = document.getElementById("job-description-editor");
    if (editor) {
      setFormData({
        ...formData,
        jobDescription: editor.innerHTML,
      });
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
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 pb-12 lg:pb-0">
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a New Gig</h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Post your project and find the perfect talent for your needs
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                {/* Description Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 mb-3">What talent are you looking for?</p>
                    <div className="flex gap-3">
                      <input
                        value={currentService}
                        onChange={(e) => setCurrentService(e.target.value)}
                        placeholder="Service name"
                        className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleServiceAdd}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {formData.services.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {formData.services.map((service, index) => (
                        <div
                          key={index}
                          className="relative group pl-4 pr-8 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-full flex items-center shadow-md"
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
                            className="absolute right-2 text-white opacity-80 hover:opacity-100 focus:outline-none"
                            aria-label={`Remove ${service}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="font-medium text-gray-800 block mb-2">Job Title</label>
                    <input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Job Title"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-800 block mb-2">Job Description</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                      {/* Text editor toolbar */}
                      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => formatText("bold")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Bold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h4a4 4 0 014 4v0a4 4 0 01-4 4H3m0-8v8m0 0h4a4 4 0 014 4v0a4 4 0 01-4 4H3m0-8v8" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText("italic")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Italic"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText("underline")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19V5a2 2 0 012-2h10a2 2 0 012 2v14m0 0H7m2 0h8" />
                          </svg>
                        </button>
                        <div className="border-l border-gray-300 mx-1 h-6"></div>
                        <button
                          type="button"
                          onClick={() => formatText("insertUnorderedList")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Bullet List"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText("insertOrderedList")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Numbered List"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <div className="border-l border-gray-300 mx-1 h-6"></div>
                        <button
                          type="button"
                          onClick={() => formatText("justifyLeft")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Align Left"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText("justifyCenter")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Align Center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8m-4 6h8" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText("justifyRight")}
                          className="p-2 rounded hover:bg-gray-200 transition-colors"
                          title="Align Right"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8m-8 6h8" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Text editor content area - FIXED: Removed RTL styling */}
                      <div
                        id="job-description-editor"
                        contentEditable
                        className="w-full p-4 min-h-[150px] bg-white focus:outline-none prose prose-sm max-w-none"
                        onInput={handleDescriptionChange}
                        dangerouslySetInnerHTML={{ __html: formData.jobDescription || "" }}
                        style={{ textAlign: 'left', direction: 'ltr' }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="font-medium text-gray-800">Specify the amount to be paid for the job</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-medium text-gray-800 block mb-2">Token</label>
                      <div className="relative">
                        <input
                          name="payment.token"
                          value={formData.payment.token}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 pl-12"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">Ξ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="font-medium text-gray-800 block mb-2">Amount (ETH)</label>
                      <input
                        name="payment.amount"
                        type="number"
                        value={formData.payment.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="font-medium text-gray-800 block mb-2">USD Equivalent</label>
                      <div className="relative">
                        <input
                          name="payment.usdAmount"
                          type="number"
                          value={formData.payment.usdAmount}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 pr-12"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 duration-300 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Continue"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>All payments are securely processed on the blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}