"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function BrowseGigs() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();


  const dummyGigs = [
    {
      id: "1",
      jobTitle: "Responsive Design Enhancement",
      role: "Frontend Developer",
      duration: "2 weeks – 07/04 – 21/04",
      tags: ["Mobile Responsive", "API Integration"],
      description: "We are looking for a frontend developer to enhance the responsive design of our web application. The project involves ensuring the application works seamlessly across all device sizes and integrating with our existing APIs.",
      replacementNote: "Need a replacement (4%)",
      hours: "1000 hours",
      userId: "0x742d35Cc6634C0532925a3b844Bc9e7595f8d8f3"
    },
    {
      id: "2",
      jobTitle: "Responsive Design Enhancement",
      role: "Frontend Developer",
      duration: "2 weeks – 07/06 – 21/04",
      tags: ["Mobile Responsive", "API Integration"],
      description: "We are looking for a frontend developer to enhance the responsive design of our web application. The project involves ensuring the application works seamlessly across all device sizes and integrating with our existing APIs.",
      replacementNote: "Need a replacement (4%)",
      hours: "1000 hours",
      userId: "0x742d35Cc6634C0532925a3b844Bc9e7595f8d8f3"
    }
  ];

  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setGigs(dummyGigs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGigs = filter === "all" 
    ? gigs 
    : gigs.filter(gig => gig.tags.includes(filter));

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64 pb-16 lg:pb-0">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin mx-auto mb-4">
                <div className="absolute top-0 left-0 w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Loading Gigs...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 pb-16 lg:pb-0">
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Gigs</h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Discover exciting opportunities and find the perfect project for your skills
              </p>
            </div>

            {/* Filter Section */}
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All Gigs
                </button>
                <button
                  onClick={() => setFilter("Frontend Developer")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === "Frontend Developer"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Frontend Developer
                </button>
                <button
                  onClick={() => setFilter("Backend Developer")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === "Backend Developer"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Backend Developer
                </button>
                <button
                  onClick={() => setFilter("UI/UX Designer")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === "UI/UX Designer"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  UI/UX Designer
                </button>
              </div>
            </div>

            {/* Gigs Grid */}
            {filteredGigs.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No gigs found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filter === "all" 
                    ? "There are no gigs available at the moment. Check back later!"
                    : `No gigs found for "${filter}". Try another filter or browse all gigs.`
                  }
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    View All Gigs
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredGigs.map((gig) => (
                  <div 
                    key={gig.id} 
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg hover:border-purple-200 group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                            {gig.jobTitle}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {gig.role}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {gig.duration}
                      </div>

                      {/* Hours */}
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {gig.hours}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {gig.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-gray-700 text-sm">
                          {gig.description}
                        </p>
                      </div>

                      {/* Replacement Note */}
                      <div className="mb-6">
                        <p className="text-sm text-red-500 font-medium">
                          {gig.replacementNote}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push(`/gig/${gig.id}`)}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          View Milestones
                        </button>
                        <button
                          onClick={() => router.push(`/apply/${gig.id}`)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}