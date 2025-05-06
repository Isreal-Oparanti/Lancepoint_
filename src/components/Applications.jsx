"use client";

import React, { useEffect, useState } from "react";
import { useZkLogin } from "use-sui-zklogin";
import { toast } from "react-hot-toast";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [groupedApplications, setGroupedApplications] = useState({});
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { accounts } = useZkLogin({
    urlZkProver: "https://prover-dev.mystenlabs.com/v1",
    generateSalt: async () => {
      return { salt: window.crypto.getRandomValues(new Uint32Array(1))[0] };
    },
  });

  const zksub = accounts?.[0]?.sub;

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/apply-gig");
      const data = await response.json();

      console.log("Fetched applications data:", data);

      const filteredApplications = data.filter((app) => app.userId === zksub);

      const grouped = filteredApplications.reduce((acc, app) => {
        if (!acc[app.jobTitle]) acc[app.jobTitle] = [];
        acc[app.jobTitle].push(app);
        return acc;
      }, {});

      setApplications(filteredApplications);
      setGroupedApplications(grouped);

      // console.log("Fetched applications:", filteredApplications);
      // console.log("Grouped applications:", grouped);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (zksub) {
      // Only fetch if we have the user's ID
      fetchApplications();
    }
  }, [zksub]); // Add zksub as dependency

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

  return (
    <div className="flex flex-col items-center w-full gap-6 justify-center mt-10">
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
            {groupedApplications[viewingApplicantsFor]?.map((app) => (
              <div
                key={app._id}
                className="bg-white h-[25rem] w-[24rem] p-4 rounded-2xl shadow-md flex flex-col justify-between"
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

                <div className="mt-[3rem]">
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

                  {app.status === "accepted" || app.status === "rejected" ? (
                    <div
                      className={`text-center py-2 rounded-3xl font-semibold ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-800 w-[8rem]"
                          : "bg-red-100 text-red-800 w-[8rem]"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        className={`bg-black text-white px-4 py-2  rounded-3xl w-[8rem] ${
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
                        className={`bg-white border border-black text-black px-4 py-2 rounded-3xl w-[8rem] ${
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
              </div>
            ))}
          </div>
        </div>
      ) : Object.keys(groupedApplications).length > 0 ? (
        Object.entries(groupedApplications).map(([jobTitle, apps]) => {
          const firstApp = apps[0];

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
