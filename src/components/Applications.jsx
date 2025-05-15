"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [groupedApplications, setGroupedApplications] = useState({});
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Extract latest assistant message
  const latestAIResponse = aiMessages
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0]?.content;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("shortWalletAddress");
      setWallet(address);
    }
  }, []);

  const handleAIReview = async (prompt) => {
    try {
      const fullAddress = localStorage.getItem("fullAddress");

      if (!fullAddress) {
        toast.error(
          "Wallet address not found. Please connect your wallet first"
        );
        return;
      }

      setIsAiThinking(true);
      const userMessage = {
        role: "user",
        content: `Please review the following submission:\n\n${prompt}`,
      };
      setAiMessages((prev) => [...prev, userMessage]);
      setInput("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage],
          walletAddress: fullAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.text };
      setAiMessages((prev) => [...prev, aiMessage]);

      // Handle any on-chain actions returned from the AI
      if (data.toolResults && data.toolResults.length > 0) {
        await handleOnChainActions(data.toolResults, fullAddress);
      }
    } catch (error) {
      console.error("AI review error:", error);
      toast.error(error.message || "AI failed to review");
    } finally {
      setIsAiThinking(false);
    }
  };
  const generateSubmissionPrompt = (submissions) => {
    if (!submissions || submissions.length === 0)
      return "No submissions available.";

    return submissions
      .map((submission, submissionIdx) => {
        return submission.submissions
          .map((milestone, idx) => {
            const proofList = milestone.proofLinks
              .map((link, i) => `- [Proof ${i + 1}](${link})`)
              .join("\n");

            return `Milestone ${idx + 1}:
Description: ${milestone.submissionDescription}
Proofs:
${proofList}`;
          })
          .join("\n\n");
      })
      .join("\n\n");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/apply-gig");
      const data = await response.json();

      const filteredApplications = data.filter((app) => app.userId === wallet);

      const grouped = filteredApplications.reduce((acc, app) => {
        if (!acc[app.jobTitle]) acc[app.jobTitle] = [];
        acc[app.jobTitle].push(app);
        return acc;
      }, {});

      setApplications(filteredApplications);
      setGroupedApplications(grouped);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/submit-gig");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchSubmissions();
      fetchApplications();
    }
  }, [wallet]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/apply-gig", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      await fetchApplications();
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplicants = (jobTitle) => {
    setViewingApplicantsFor(
      viewingApplicantsFor === jobTitle ? null : jobTitle
    );
  };

  const getSubmissionsForJob = (jobTitle, jobDescription) => {
    return submissions.filter(
      (sub) =>
        sub.userId === wallet &&
        sub.jobTitle === jobTitle &&
        sub.jobDescription === jobDescription
    );
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 justify-center my-10 ">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : viewingApplicantsFor ? (
        <div className="flex flex-col w-full max-w-[54rem]">
          <button
            onClick={() => setViewingApplicantsFor(null)}
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
            Back to jobs
          </button>
          <div className="flex flex-wrap p-6 rounded-lg space-y-6 w-full justify-center gap-10">
            {groupedApplications[viewingApplicantsFor]?.map((app) => {
              const jobSubmissions = getSubmissionsForJob(
                app.jobTitle,
                app.jobDescription
              );

              return (
                <div
                  key={app._id}
                  className="bg-white min-h-[25rem] w-[24rem] p-4 rounded-2xl shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg">{app.name}</h3>

                    <div className="flex gap-2 my-2">
                      <div className="p-1 bg-black text-white text-[12px] text-center rounded-[20px] font-[600] min-w-[9rem]">
                        {app.services[0]}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">
                      {app.applicationText}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="mt-4 ">
                      {app.portfolioLink && (
                        <a
                          href={app.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-3 p-3 bg-black text-white text-[12px] text-center rounded-3xl font-[600] w-[8rem]"
                        >
                          Portfolio
                        </a>
                      )}

                      {app.status === "accepted" ||
                      app.status === "rejected" ? (
                        <div
                          className={`text-center py-2 rounded-3xl font-semibold  ${
                            app.status === "accepted"
                              ? "bg-green-100 text-green-800 w-[8rem]"
                              : "bg-red-100 text-red-800 w-[8rem]"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <button
                            className={`bg-black text-white px-4 py-2 rounded-3xl w-[8rem] cursor-pointer ${
                              isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() =>
                              updateApplicationStatus(app._id, "accepted")
                            }
                            disabled={isLoading}
                          >
                            Accept
                          </button>
                          <button
                            className={`bg-white border border-black text-black px-4 py-2 rounded-3xl w-[8rem] cursor-pointer ${
                              isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() =>
                              updateApplicationStatus(app._id, "rejected")
                            }
                            disabled={isLoading}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    {jobSubmissions.length > 0 && (
                      <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-black cursor-pointer text-white rounded"
                      >
                        View Submissions
                      </button>
                    )}
                  </div>
                  {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/20 backdrop-blur-sm">
                      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 border border-black overflow-y-auto max-h-[80vh] relative">
                        <h2 className="text-xl font-semibold text-start">
                          Submissions
                        </h2>

                        {jobSubmissions.length === 0 ? (
                          <p className="text-sm text-gray-600">
                            No submissions available.
                          </p>
                        ) : (
                          jobSubmissions.map((submission) => (
                            <div key={submission._id} className="space-y-4">
                              {submission.submissions.map((sub, idx) => (
                                <div
                                  key={idx}
                                  className="border border-black rounded-md p-4"
                                >
                                  <h3 className="font-semibold text-sm mb-2">
                                    Milestone {idx + 1}
                                  </h3>
                                  <p className="text-sm mb-2">
                                    {sub.submissionDescription}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {sub.proofLinks.map((link, linkIdx) => (
                                      <a
                                        key={linkIdx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 bg-black cursor-pointer text-white rounded"
                                      >
                                        Proof {linkIdx + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))
                        )}

                        <div className="mt-6 pt-4 border-t">
                          <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            AI Submission Review
                          </h3>

                          <div className="flex flex-col md:flex-row gap-3 mb-6">
                            <input
                              value={input}
                              placeholder="Ask something about the submission..."
                              onChange={handleInputChange}
                              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const submissionPrompt =
                                    generateSubmissionPrompt(jobSubmissions);
                                  handleAIReview(submissionPrompt);
                                }}
                                className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition"
                              >
                                Review Submission with AI
                              </button>

                              <button
                                onClick={handleAIReview}
                                disabled={!input.trim() || isAiThinking}
                                className="bg-white border border-black text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition disabled:opacity-50"
                              >
                                {isAiThinking ? "Thinking..." : "Send"}
                              </button>
                            </div>
                          </div>

                          {/* Chat History */}
                          {aiMessages.length > 0 && (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-[300px] overflow-y-auto">
                              {aiMessages.map((message, index) => (
                                <div
                                  key={index}
                                  className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                                    message.role === "user"
                                      ? "bg-black text-white ml-auto"
                                      : "bg-white border border-gray-300 text-gray-800"
                                  }`}
                                >
                                  <strong>
                                    {message.role === "user" ? "You" : "AI"}:
                                  </strong>{" "}
                                  {message.content}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={() => setShowModal(false)}
                            className="block mb-3 p-3 bg-black text-white text-[12px] text-center rounded-3xl font-[600] w-[8rem]  cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : Object.keys(groupedApplications).length > 0 ? (
        Object.entries(groupedApplications).map(([jobTitle, apps]) => {
          const firstApp = apps[0];
          const jobSubmissions = getSubmissionsForJob(
            jobTitle,
            firstApp.jobDescription
          );

          return (
            <div
              key={firstApp._id}
              className="bg-white p-6 rounded-lg shadow-md space-y-6 w-full max-w-[54rem]"
            >
              <div className="text-2xl font-semibold text-left">{jobTitle}</div>

              <div className="flex flex-wrap gap-2">
                <div className="p-2 bg-black text-white text-[12px] text-center rounded-4xl font-[600] min-w-[9rem]">
                  {firstApp.services[0]}
                </div>

                <div className="p-2 bg-[#2A4A2B] text-[#61FF00] text-[12px] text-center rounded-4xl font-[600] min-w-[9rem]">
                  {firstApp.paymentAmount} {firstApp.paymentToken}
                </div>
              </div>

              <p className="font-medium text-[12px] text-black">
                {firstApp.jobDescription}
              </p>

              {/* Show submission status if submissions exist */}

              {/* {jobSubmissions.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Submission Status:</h4>
                  {jobSubmissions.map((submission) => (
                    <div key={submission._id}>
                      {renderMilestones(submission.milestones)}
                    </div>
                  ))}
                </div>
              )} */}

              <div className="flex flex-wrap justify-between gap-2">
                <button
                  className="p-3 bg-black text-white text-[14px] text-center rounded-4xl font-[600] w-full max-w-[10rem] md:w-[12rem] transition cursor-pointer"
                  onClick={() => handleViewApplicants(jobTitle)}
                >
                  View Applicants
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">No applications Yet</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
