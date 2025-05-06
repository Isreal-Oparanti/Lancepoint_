"use client";

import React, { useEffect, useState } from "react";
import { useZkLogin } from "use-sui-zklogin";
import { toast } from "react-hot-toast";

const LiveGigs = () => {
  const { accounts } = useZkLogin({
    urlZkProver: "https://prover-dev.mystenlabs.com/v1",
    generateSalt: async () => {
      return { salt: window.crypto.getRandomValues(new Uint32Array(1))[0] };
    },
  });

  const zksub = accounts?.[0]?.sub;
  const [liveGigs, setLiveGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null); // Track which gig's milestones are being viewed

  const fetchLiveGig = async () => {
    try {
      const response = await fetch("/api/apply-gig");
      if (!response.ok) throw new Error("Failed to fetch live gig data");
      const data = await response.json();
      console.log("Fetched live gig data:", data);
      setLiveGigs(data);

      const filtered = data.filter(
        (gig) => gig.status === "accepted" && gig.applicantId === zksub
      );
      setFilteredGigs(filtered);
    } catch (error) {
      toast.error(`Error loading gig data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGig();
  }, [zksub]);

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
                  <div className="text-[24px] font-semibold  mb-2">
                    Milestone {index + 1}
                  </div>
                  <div className="font-[600] text-[16px]">
                    {milestone.header}
                  </div>
                  <div className=" text-[14px] font-[500] mb-3">
                    {milestone.body}
                  </div>
                  <div className="text-[14px] font-[500] mb-3">
                    <div className="font-[600] text-[16px]">Deadline</div>

                    <div className="text-[red] font-[700] text-[14px]">
                      {milestone.date}
                    </div>
                  </div>
                  <div className="font-[600] text-[16px]">
                    Under Verification
                  </div>
                </div>
              ))}
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
