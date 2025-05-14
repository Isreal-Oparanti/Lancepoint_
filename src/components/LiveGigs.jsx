"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const LiveGigs = () => {
  const [wallet, setWallet] = useState(null);

  const [liveGigs, setLiveGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [proofLinks, setProofLinks] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("shortWalletAddress");
      setWallet(address);
    }
  }, []);

  const fetchLiveGig = async () => {
    try {
      const response = await fetch("/api/apply-gig");
      if (!response.ok) throw new Error("Failed to fetch live gig data");
      const data = await response.json();
      setLiveGigs(data);

      const filtered = data.filter(
        (gig) => gig.status === "accepted" && gig.applicantId === wallet
      );
      setFilteredGigs(filtered);
    } catch (error) {
      toast.error(`Error loading gig data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("gigId", selectedGig._id);
      formData.append("milestoneIndex", milestoneIndex.toString());
      formData.append("jobTitle", selectedGig.jobTitle);
      formData.append("jobDescription", selectedGig.jobDescription);
      formData.append("userId", selectedGig.userId);
      formData.append("applicantId", wallet);
      formData.append("startDate", selectedGig.startDate);
      formData.append("endDate", selectedGig.endDate);
      formData.append("paymentAmount", selectedGig.paymentAmount);
      formData.append("paymentToken", selectedGig.paymentToken);
      formData.append("submissionDescription", submissionDescription);

      proofLinks
        .filter((link) => link.trim() !== "")
        .forEach((link, index) => {
          formData.append(`proofLinks[${index}]`, link);
        });

      const response = await fetch("/api/submit-gig", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      toast.success("Milestone submitted successfully!");
      setShowApplicationModal(false);
      setProofLinks([""]);
      setSubmissionDescription("");
      await fetchLiveGig();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  // const fetchSubmissions = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch("/api/submit-gig");
  //     const data = await response.json();
  //     console.log('Fetched submissions:', data);
  //   } catch (error) {
  //     console.error("Error fetching submissions", error);
  //     toast.error("Failed to load submissions");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchLiveGig();
  }, [wallet]);

  const handleViewMilestones = (gig) => {
    setSelectedGig(gig);
  };

  const handleBackToGig = () => {
    setSelectedGig(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Loading Gigs...</p>
      </div>
    );
  }

  if (filteredGigs.length === 0) {
    return (
      <div className="flex justify-center mt-20 mb-10 px-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full max-w-4xl">
          <div className="text-2xl font-semibold text-left">
            No Accepted Gigs Found
          </div>
          <p>You don't have any Live Gig.</p>
        </div>
      </div>
    );
  }

  if (selectedGig) {
    return (
      <div className="flex justify-center mt-20 mb-10 px-4">
        <div className="p-6 md:p-8 rounded-lg space-y-6 w-full max-w-4xl">
          <button
            onClick={handleBackToGig}
            className="flex items-center gap-2 mb-6 self-start text-black hover:underline cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          {selectedGig.milestones?.length > 0 ? (
            <div className="space-y-4">
              {selectedGig.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-4 rounded-lg bg-white"
                >
                  <div className="text-[24px] font-semibold mb-2">
                    Milestone {index + 1}
                  </div>
                  <div className="font-[600] text-[16px]">
                    {milestone.header}
                  </div>
                  <div className="text-[14px] font-[500] mb-3">
                    {milestone.body}
                  </div>
                  <div className="text-[14px] font-[500] mb-3">
                    <div className="font-[600] text-[16px]">Deadline</div>
                    <div className="text-[red] font-[700] text-[14px]">
                      {milestone.date}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-[600] text-[16px]">
                      Under Verification
                    </div>
                    {milestone.status !== "submitted" && (
                      <div
                        className="p-2 bg-black text-white w-[9rem] text-[12px] text-center rounded-4xl font-[600] flex items-center justify-start flex-col space-y-1 cursor-pointer"
                        onClick={() => {
                          setMilestoneIndex(index);
                          setShowApplicationModal(true);
                        }}
                      >
                        Submit Milestone
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {showApplicationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/20 backdrop-blur-sm">
                  <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 border border-black">
                    <h1 className="font-[600] text-xl">Submit Milestone</h1>
                    <form onSubmit={handleSubmitMilestone}>
                      <label
                        htmlFor="submissionDescription"
                        className="text-[14px]"
                      >
                        Work Description
                      </label>
                      <textarea
                        id="submissionDescription"
                        className="w-full border-black border p-2 rounded-md placeholder:text-xs mb-4"
                        placeholder="Describe the work you've completed for this milestone"
                        rows={3}
                        required
                        value={submissionDescription}
                        onChange={(e) =>
                          setSubmissionDescription(e.target.value)
                        }
                      ></textarea>

                      <label className="text-[14px]">Proof of Work</label>
                      <div className="space-y-2 mb-4">
                        {proofLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => {
                                const newLinks = [...proofLinks];
                                newLinks[index] = e.target.value;
                                setProofLinks(newLinks);
                              }}
                              className="flex-1 border-black border p-2 rounded-md placeholder:text-xs"
                              placeholder={
                                index === 0
                                  ? "Link to your work (GitHub, Google Drive, etc.)"
                                  : "Additional proof link"
                              }
                              required={index === 0}
                            />

                            {index > 0 && (
                              <button
                                type="button"
                                className="text-red-500 font-bold"
                                onClick={() => {
                                  setProofLinks(
                                    proofLinks.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                ×
                              </button>
                            )}

                            {index === proofLinks.length - 1 &&
                              proofLinks.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (link.trim() === "") {
                                      toast.error(
                                        "Please enter a link before adding another"
                                      );
                                      return;
                                    }
                                    setProofLinks([...proofLinks, ""]);
                                  }}
                                  className={`bg-black text-white px-4 py-2 rounded-md font-medium cursor-pointer ${
                                    link.trim() === ""
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  disabled={link.trim() === ""}
                                >
                                  Add
                                </button>
                              )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between space-x-2 mt-4">
                        <button
                          type="submit"
                          className="w-full bg-black text-white py-2 rounded-xl font-semibold text-[14px] cursor-pointer flex justify-center items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="flex justify-between space-x-2">
                      <button
                        onClick={() => {
                          setShowApplicationModal(false);
                          setProofLinks([""]);
                          setSubmissionDescription("");
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
          ) : (
            <p>No milestones have been added to this gig yet.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {filteredGigs.map((gig) => (
        <div key={gig._id} className="flex justify-center mt-20 mb-10 px-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6 w-full max-w-4xl">
            <div className="text-2xl font-semibold text-left">
              {gig.jobTitle}
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-2 bg-black text-white w-[6rem] text-[12px] text-center rounded-4xl font-[600] flex items-center justify-start flex-col space-y-2">
                {gig.name}
              </div>
              <div className="p-2 bg-black text-white w-[6rem] text-[12px] text-center rounded-4xl font-[600] flex items-center justify-start flex-col space-y-2">
                {gig.services[0]}
              </div>
            </div>

            <div>
              <p className="font-medium text-[12px] text-black">
                {gig.jobDescription}
              </p>
            </div>

            <button
              onClick={() => handleViewMilestones(gig)}
              className="p-2 bg-black text-white w-[9rem] text-[12px] text-center rounded-4xl font-[600] flex items-center justify-start flex-col space-y-1 cursor-pointer"
            >
              View Milestones
            </button>

            <span
              className="text-[red] font-[700] text-[14px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Submission {gig.endDate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveGigs;
