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

      // Filter gigs I created
      const createdByMe = allJobs
        .filter((job) => job.account.client.toString() === publicKey.toString())
        .map((job) => ({
          ...job.account,
          id: job.publicKey.toString(),
          role: "creator",
        }));

      // Filter gigs I applied for
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

  const handleApproveApplication = async (gig: any) => {
    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(gig.id).toBuffer(),
          new PublicKey(gig.application?.applicant ?? "").toBuffer(),
        ],
        program.programId
      );

      const tx = await program.methods
        .approveApplication()
        .accounts({
          application: applicationPda,
          jobPost: new PublicKey(gig.id),
          client: provider.wallet.publicKey,
        } as any)
        .rpc();

      toast.success("✅ Application approved!");
      console.log("Tx:", tx);
      fetchMyGigs();
      setDrawerOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink.trim() || !narration.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const provider = getProvider();
      const program = new Program<LpProgram>(idl, provider);

      const [applicationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("application"),
          new PublicKey(selectedGig.id).toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const tx = await program.methods
        .submitWork(submissionLink, narration)
        .accounts({
          application: applicationPda,
          freelancer: provider.wallet.publicKey,
          jobPost: new PublicKey(selectedGig.id),
        } as any)
        .rpc();

      toast.success("✅ Work submitted!");
      console.log("Tx:", tx);
      fetchMyGigs();
      setDrawerOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  if (loading)
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <Spin tip="Loading your gigs..." size="large" />
        </div>
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
        width={420}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {drawerType === "approve" && selectedGig?.application ? (
          <div>
            <p>
              <b>Freelancer:</b>{" "}
              {selectedGig.application.applicant.slice(0, 6)}...
              {selectedGig.application.applicant.slice(-4)}
            </p>
            <p>
              <b>Resume:</b>{" "}
              <a
                href={selectedGig.application.resumeLink}
                target="_blank"
                className="text-blue-600"
              >
                View Portfolio
              </a>
            </p>
            <Button

              block
              type="primary"
              className="bg-purple-600 hover:bg-purple-700 border-none text-white"
              onClick={() => handleApproveApplication(selectedGig)}
            >
              Approve Proposal
            </Button>
          </div>
        ) : drawerType === "submit" ? (
          <form onSubmit={handleSubmitWork}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Submission Link
            </label>
            <Input
              placeholder="https://yourworklink.com"
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
              className="mb-4"
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Narration / Description
            </label>
            <Input.TextArea
              placeholder="Describe your work..."
              rows={4}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="mb-4"
            />
            <Button
              type="primary"
              className="bg-purple-600 hover:bg-purple-700 border-none text-white"
              htmlType="submit" block
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
