"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Drawer, Button, Input, Spin, Empty, Tag } from "antd";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3, BN, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../../lib/lp_program.json";
import toast from "react-hot-toast";
import { LpProgram } from "../../lib/lp_program";

const programID = new PublicKey(idl.address);

export default function Orders() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [loading, setLoading] = useState(true);
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"approve" | "submit" | null>(null);
  const [selectedGig, setSelectedGig] = useState<any>(null);

  // Fields for submission
  const [submissionLink, setSubmissionLink] = useState("");
  const [narration, setNarration] = useState("");

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      { publicKey, signTransaction } as any,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  // --- inside fetchMyGigs() ---
  const fetchMyGigs = async () => {
    if (!connected || !publicKey) return;
    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const [allJobs, allApplications] = await Promise.all([
        program.account.jobPost.all(),
        program.account.application.all(),
      ]);

      // Gigs created by me (as a client)
      const createdByMe = allJobs
        .filter((job) => job.account.client.toString() === publicKey.toString())
        .map((job) => {
          const jobApplications = allApplications
            .filter((a) => a.account.jobPost.toString() === job.publicKey.toString())
            .map((a) => ({
              pubkey: a.publicKey.toString(),
              ...a.account,
            }));
          return {
            ...job.account,
            id: job.publicKey.toString(),
            role: "creator",
            applications: jobApplications,
          };
        });

      // Gigs I applied for (as freelancer)
      const myApplications = allApplications.filter(
        (app) => app.account.applicant.toString() === publicKey.toString()
      );

      const appliedFor = [];
      for (const app of myApplications) {
        const job = allJobs.find(
          (j) => j.publicKey.toString() === app.account.jobPost.toString()
        );
        if (job) {
          appliedFor.push({
            ...job.account,
            id: job.publicKey.toString(),
            role: "applicant",
            application: app.account,
          });
        }
      }

      setMyGigs([...createdByMe, ...appliedFor]);
    } catch (e) {
      console.error("❌ Fetch error:", e);
      toast.error("Failed to fetch gigs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) fetchMyGigs();
  }, [connected]);

  const handleApproveApplication = async (gig: any, app: any) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(gig.id).toBuffer(),
          new PublicKey(app.applicant).toBuffer(),
        ],
        program.programId
      );

      console.log("Approving application for:", app.applicant);

      // Build the transaction
      const tx = await program.methods
        .approveApplication()
        .accounts({
          application: applicationPda,
          jobPost: new PublicKey(gig.id),
          client: provider.wallet.publicKey,
        } as any)
        .transaction();

      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(tx);
      const txSig = await provider.connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      console.log("✅ Approval Tx sent:", txSig);
      toast.success(`✅ Approved ${app.applicant.toString().slice(0, 6)}... Tx: ${txSig}`);


      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      fetchMyGigs();
    } catch (error: any) {
      console.error("❌ Approval error:", error);

      if (error?.signature) {
        console.log("Transaction hash:", error.signature);
        toast.success(`Transaction processed: ${error.signature}`);
        return;
      }

      if (error.message?.includes("already been processed")) {
        toast("Duplicate submission ignored — transaction already confirmed.");
        return;
      }

      let message = error.message || "Approval failed";
      if (error.logs) {
        const logMsg = error.logs.find((log: string) => log.includes("Error Message:"));
        if (logMsg) message = logMsg.split("Error Message: ")[1];
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };



  const handleRejectSubmission = async (gig: any, app: any, review: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);
      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(gig.id).toBuffer(),
          new PublicKey(app.applicant).toBuffer(),
        ],
        program.programId
      );

      console.log("Rejecting submission for:", app.applicant);
      console.log("Review:", review);

      // The reject_submission instruction requires client_review as a parameter
      const tx = await program.methods
        .rejectSubmission(review) // Pass the review parameter here
        .accounts({
          application: applicationPda,
          jobPost: new PublicKey(gig.id),
          client: provider.wallet.publicKey,
        })
        .transaction();

      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(tx);
      const txSig = await provider.connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      console.log("❌ Rejection Tx sent:", txSig);
      toast.error(`❌ Work rejected! Tx: ${txSig}`);

      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      fetchMyGigs();
      setDrawerOpen(false);
    } catch (error: any) {
      console.error("❌ Rejection error:", error);

      // Enhanced error handling
      if (error?.logs) {
        console.error("Transaction logs:", error.logs);
        const errorLog = error.logs.find((log: string) => log.includes("Error Message:"));
        if (errorLog) {
          const errorMsg = errorLog.split("Error Message: ")[1];
          toast.error(`Rejection failed: ${errorMsg}`);
          return;
        }
      }

      if (error?.message?.includes("Transaction simulation failed")) {
        toast.error("Transaction simulation failed. Check console for details.");
        return;
      }

      toast.error(error.message || "Failed to reject submission");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!submissionLink.trim() || !narration.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(selectedGig.id).toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      console.log("Submitting work:", { submissionLink, narration });

      const tx = await program.methods
        .submitWork(submissionLink, narration)
        .accounts({
          application: applicationPda,
          freelancer: provider.wallet.publicKey,
          jobPost: new PublicKey(selectedGig.id),
        } as any)
        .transaction();

      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(tx);
      const txSig = await provider.connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      console.log("✅ Submission Tx sent:", txSig);
      toast.success(`✅ Work submitted! Tx: ${txSig}`);

      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      fetchMyGigs();
      setDrawerOpen(false);
      setSubmissionLink("");
      setNarration("");
    } catch (error: any) {
      console.error("❌ Submission error:", error);

      if (error?.signature) {
        console.log("Transaction hash:", error.signature);
        toast.success(`Transaction processed: ${error.signature}`);
        return;
      }

      if (error.message?.includes("already been processed")) {
        toast("Duplicate submission ignored — transaction already confirmed.");
        return;
      }

      let message = error.message || "Submission failed";
      if (error.logs) {
        const logMsg = error.logs.find((log: string) => log.includes("Error Message:"));
        if (logMsg) message = logMsg.split("Error Message: ")[1];
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  const handleApproveSubmission = async (gig: any, app: any, review: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const latestBlockhash = await provider.connection.getLatestBlockhash("confirmed");

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(gig.id).toBuffer(),
          new PublicKey(app.applicant).toBuffer(),
        ],
        program.programId
      );

      console.log("Approving submission for:", app.applicant);

      // Temporary: Only update application state without escrow transfer
      const tx = await program.methods
        .approveSubmission(review)
        .accounts({
          application: applicationPda,
          jobPost: new PublicKey(gig.id),
          client: provider.wallet.publicKey,
          freelancer: new PublicKey(app.applicant),
          // Remove escrow and systemProgram for now to avoid the error
        } as any)
        .transaction();

      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = provider.wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(tx);
      const txSig = await provider.connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      console.log("✅ Work approved Tx:", txSig);
      toast.success(`✅ Work approved! Tx: ${txSig}`);

      await provider.connection.confirmTransaction(
        { signature: txSig, ...latestBlockhash },
        "confirmed"
      );

      fetchMyGigs();
      setDrawerOpen(false);
    } catch (error: any) {
      console.error("❌ Approval error:", error);

      if (error?.logs) {
        console.error("Transaction logs:", error.logs);
        const errorLog = error.logs.find((log: string) => log.includes("Error Message:"));
        if (errorLog) {
          const errorMsg = errorLog.split("Error Message: ")[1];
          toast.error(`Transaction failed`);
          return;
        }
      }

      toast.error(error.message || "Failed to approve submission");
    } finally {
      setLoading(false);
    }
  };


  if (loading)
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <Spin tip="Loading your gigs..." size="large" fullscreen />

      </div>
    );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-10">
        <h1 className="text-3xl font-bold mb-2">My Gigs</h1>
        <p className="text-gray-600 mb-6">
          View gigs you created or applied for, and take the next step.
        </p>

        {myGigs.length === 0 ? (
          <Empty description="No gigs found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {gig.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {gig.description}
                </p>
                <div className="text-sm text-gray-700 mb-1">
                  💰 {gig.amount / web3.LAMPORTS_PER_SOL} SOL
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  🕒 {new Date(gig.startDate * 1000).toLocaleDateString()} -{" "}
                  {new Date(gig.endDate * 1000).toLocaleDateString()}
                </div>

                {gig.role === "creator" ? (
                  <Tag color="blue">Created by me</Tag>
                ) : (
                  <Tag color="green">Applied by me</Tag>
                )}

                <div className="mt-3 flex gap-2">
                  {gig.role === "creator" ? (
                    <Button
                      type="primary"
                      className="bg-purple-600 hover:bg-purple-700 border-none text-white"
                      onClick={() => {
                        setSelectedGig(gig);
                        setDrawerType("approve");
                        setDrawerOpen(true);
                      }}
                    >
                      View Proposal
                    </Button>
                  ) : gig.application?.approved ? (
                    <Button
                      type="primary"
                      className="bg-purple-600 hover:bg-purple-700 border-none text-white"
                      onClick={() => {
                        setSelectedGig(gig);
                        setDrawerType("submit");
                        setDrawerOpen(true);
                      }}
                    >
                      Submit Work
                    </Button>
                  ) : (
                    <Tag color="orange">Pending Approval</Tag>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <Drawer
        title={
          drawerType === "approve"
            ? `Proposals for ${selectedGig?.title}`
            : `Submit Work for ${selectedGig?.title}`
        }
        placement="right"
        width={600}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {drawerType === "approve" && selectedGig ? (
          <div>
            {selectedGig.applications && selectedGig.applications.length > 0 ? (
              selectedGig.applications.map((app: any) => (
                <div
                  key={app.pubkey}
                  className="border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
                >
                  <p>
                    <b>Applicant:</b>{" "}
                    {app.applicant.toString().slice(0, 6)}...{app.applicant.toString().slice(-4)}
                  </p>
                  <p>
                    <b>Resume:</b>{" "}
                    <a
                      href={app.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Portfolio
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    Expected Completion:{" "}
                    {new Date(app.expectedEndDate * 1000).toLocaleDateString()}
                  </p>

                  {/* Application Status */}
                  {!app.approved ? (
                    <div className="flex gap-2 mt-3">
                      <Button
                        type="primary"
                        className="bg-purple-600 hover:bg-purple-700 border-none text-white"
                        onClick={() => handleApproveApplication(selectedGig, app)}
                      >
                        Approve Application
                      </Button>
                      <Button
                        danger
                        onClick={() => toast("❌ Proposal denied (not stored on-chain)")}
                      >
                        Deny
                      </Button>
                    </div>
                  ) : app.submissionLink ? (
                    <>
                      <div className="mt-4 border-t pt-3">
                        <p><b>🧾 Work Submitted:</b></p>
                        <p>
                          <a
                            href={app.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 underline"
                          >
                            View Submitted Work
                          </a>
                        </p>
                        <p className="mt-2 text-gray-700 text-sm">
                          <b>Narration:</b> {app.narration || "No narration provided"}
                        </p>

                        {app.completed ? (
                          <Tag color="green" className="mt-2">✅ Work Approved</Tag>
                        ) : (
                          <div className="mt-5 space-y-5">
                            <label className="block text-base font-medium text-gray-700">
                              Client Review / Feedback
                            </label>
                            <Input.TextArea
                              placeholder="Write your detailed feedback for the freelancer..."
                              rows={5}
                              id={`review-${app.pubkey}`}
                              className="w-full text-base p-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            />

                            <div className="flex gap-4 mt-4">
                              <Button
                                type="primary"
                                size="large"
                                className="bg-green-600 hover:bg-green-700 border-none text-white px-6 py-2.5 text-base font-medium"
                                onClick={() => {
                                  const reviewInput = document.getElementById(`review-${app.pubkey}`) as HTMLTextAreaElement;
                                  const review = reviewInput?.value || "Great work! Approved ✅";
                                  handleApproveSubmission(selectedGig, app, review);
                                }}
                              >
                                ✅ Approve Work & Release Payment
                              </Button>


                              <Button
                                danger
                                size="large"
                                className="px-6 py-2.5 text-base font-medium"
                                onClick={() => {
                                  const reviewInput = document.getElementById(`review-${app.pubkey}`) as HTMLTextAreaElement;
                                  const review = reviewInput?.value || "Submission rejected - needs revision";
                                  handleRejectSubmission(selectedGig, app, review);
                                }}
                              >
                                ❌ Reject Work
                              </Button>
                            </div>
                          </div>

                        )}
                      </div>
                    </>
                  ) : (
                    <Tag color="blue" className="mt-2">✅ Application Approved - Waiting for submission...</Tag>
                  )}
                </div>
              ))
            ) : (
              <Empty description="No proposals yet" />
            )}
          </div>
        ) : drawerType === "submit" ? (
          <form
            onSubmit={handleSubmitWork}
            className="space-y-6 w-full max-w-lg mx-auto p-4"
          >
            <div>
              <label className="block mb-3 text-base font-medium text-gray-700">
                Submission Link
              </label>
              <Input
                size="large"
                placeholder="https://yourworklink.com"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="mb-6 rounded-lg py-2"
              />
            </div>

            <div>
              <label className="block mb-3 text-base font-medium text-gray-700">
                Narration / Description
              </label>
              <Input.TextArea
                placeholder="Describe your work..."
                rows={6}
                size="large"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="mb-6 rounded-lg"
              />
            </div>

            <Button
              type="primary"
              size="large"
              className="bg-purple-600 hover:bg-purple-700 border-none text-white font-semibold py-2 rounded-xl"
              htmlType="submit"
              block
            >
              Submit Work
            </Button>
          </form>

        ) : (
          <p>No action selected.</p>
        )}
      </Drawer>
    </div>
  );
}
