"use client";

import React, { useEffect, useState } from "react";

import { toast } from "react-hot-toast";

const BrowseGigs = () => {
  const [wallet, setWallet] = useState(null);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

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
        console.log("Fetched gig data:", data);
        setGigs(data);
      } catch (error) {
        toast.error(`Error loading gig data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGigData();
  }, [wallet]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("applicantId", wallet);

    setApplying(true);

    try {
      const res = await fetch("/api/apply-gig", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(
          `Application failed: ${
            result.error?.applicationText ||
            result.error?.database ||
            "Unknown error"
          }`
        );
      } else {
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
        setSelectedJob(null);
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const handleViewMilestones = (milestonesData) => {
    setMilestones(milestonesData || []);
    setShowMilestoneModal(true);
  };

  const handleApplyClick = (gig) => {
    setSelectedJob(gig);
    setShowApplicationModal(true);
  };

  const closeModal = () => {
    setShowMilestoneModal(false);
    setMilestones([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Loading Gigs...</p>
      </div>
    );
  }

  return (
    <div className="px-4">
      {gigs.map((gig) => {
        const isOwner = gig.userId === wallet;

        return (
          <div key={gig._id} className="flex justify-center mt-10 mb-10">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full max-w-4xl">
              <div className="text-2xl font-semibold text-left">
                {gig.jobTitle}
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-black text-white w-[9rem] text-[12px] text-center rounded-4xl font-medium">
                  {gig.services?.[0] || "Service"}
                </div>
                <div className="p-2  bg-[#337936] text-white w-[9rem] text-[12px] text-center rounded-4xl font-medium">
                  {gig.payment?.amount} {gig.payment?.token}
                </div>
                <div className="p-2   bg-black text-white w-[12rem] text-[12px] text-center rounded-4xl font-medium">
                  {gig.startDate} - {gig.endDate}
                </div>
              </div>

              <p className="font-medium text-[12px] text-gray-500">
                {gig.jobDescription}
              </p>

              <div className="flex items-center space-x-2">
                {gig.services?.map((service, i) => (
                  <div
                    key={i}
                    className="p-2  bg-black text-white w-[9rem] text-[12px] text-center rounded-4xl font-medium"
                  >
                    {service}
                  </div>
                ))}
              </div>

              <div className="flex justify-start items-center">
                <div
                  onClick={() => handleViewMilestones(gig.milestones)}
                  className="p-2  bg-black text-white w-[9rem] text-[14px] text-center rounded-4xl font-[600] cursor-pointer"
                >
                  View Milestones
                </div>
              </div>

              <div className="flex justify-start items-center">
                <div
                  onClick={() => handleApplyClick(gig)}
                  className={`p-3 w-[9rem] text-[14px] shadow-md text-center rounded-4xl font-[600] ${
                    isOwner
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black cursor-pointer"
                  }`}
                  style={{
                    pointerEvents: isOwner ? "none" : "auto",
                    opacity: isOwner ? 0.5 : 1,
                  }}
                >
                  Apply
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Milestones Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 border-black border">
            <h2 className="text-xl font-semibold text-center mb-2">
              Milestones
            </h2>
            {milestones.length > 0 ? (
              milestones.map((ms, i) => (
                <div
                  key={i}
                  className="border p-3 rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="font-bold">{ms.header}</h3>
                  <p className="text-sm text-gray-700">{ms.body}</p>
                  <p className="text-xs text-gray-500 mt-1">Date: {ms.date}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-600">
                No milestones available.
              </p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-black text-white py-2 rounded-xl font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 border border-black">
            <h2 className="text-xl font-semibold text-start">
              Job Application
            </h2>

            <div>
              <p className="font-[400] text-[12px]">
                Let the employer know what you are offering.
              </p>
            </div>

            <form onSubmit={handleSubmitApplication}>
              <label htmlFor="" className="text-[14px]">
                Full Name
              </label>
              <input
                className="w-full border-black border p-2 rounded-md placeholder:text-xs mb-2"
                name="name"
                placeholder="Your full name"
                required
              />
              <label htmlFor="" className="text-[14px]">
                Cover Letter
              </label>

              <textarea
                className="border border-black rounded-md w-full p-2 placeholder:text-xs"
                name="applicationText"
                placeholder="What services will you be offering?"
                rows={3}
              ></textarea>
              <label htmlFor="" className="text-[14px]">
                Portfolio Link
              </label>

              <input
                className="w-full border-black border p-2 rounded-md placeholder:text-xs"
                name="portfolioLink"
                placeholder="Github / Portfolio /LinkdIn...."
              />

              <input
                type="hidden"
                name="jobTitle"
                value={selectedJob.jobTitle}
              />
              <input
                type="hidden"
                name="jobDescription"
                value={selectedJob.jobDescription}
              />
              <input type="hidden" name="userId" value={selectedJob.userId} />
              <input
                type="hidden"
                name="startDate"
                value={selectedJob.startDate}
              />
              <input type="hidden" name="endDate" value={selectedJob.endDate} />
              <input
                type="hidden"
                name="paymentAmount"
                value={selectedJob.payment?.amount}
              />
              <input
                type="hidden"
                name="paymentToken"
                value={selectedJob.payment?.token}
              />

              {selectedJob.services?.map((service, i) => (
                <input
                  key={`service-${i}`}
                  type="hidden"
                  name={`services[${i}]`}
                  value={service}
                />
              ))}

              {selectedJob.milestones?.map((ms, i) => (
                <div key={`ms-${i}`}>
                  <input
                    type="hidden"
                    name={`milestones[${i}].header`}
                    value={ms.header}
                  />
                  <input
                    type="hidden"
                    name={`milestones[${i}].body`}
                    value={ms.body}
                  />
                  <input
                    type="hidden"
                    name={`milestones[${i}].date`}
                    value={ms.date}
                  />
                </div>
              ))}

              <div className="flex justify-between font-[600] text-[12px] mt-4">
                <span className="">Submission Deadline</span>
                <span>{selectedJob.endDate}</span>
              </div>
              <div className="flex justify-between font-[600] text-[12px] my-3">
                <span>Payment</span>
                <span>
                  {selectedJob.payment?.amount} {selectedJob.payment?.token}
                </span>
              </div>
              <div className="flex justify-between space-x-2 mt-4">
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full bg-black text-white py-2 rounded-xl font-semibold text-[14px] cursor-pointer"
                >
                  {applying ? "Applying..." : "Apply"}{" "}
                </button>
              </div>
            </form>

            {/* Cancel Button */}
            <div className="flex justify-between space-x-2">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedJob(null);
                }}
                className="mt-4 w-full bg-white border border-black text-black py-2 rounded-xl font-semibold text-[14px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
