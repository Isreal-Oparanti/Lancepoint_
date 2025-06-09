"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Client, type Signer, type Identifier } from "@xmtp/browser-sdk";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";

const XMTPMessenger = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Map<string, boolean> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { content: string; sender: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [conversations, setConversations] = useState<any[]>([]);

  const identities: Identifier[] = [
    {
      identifier: "0x6A47E7f6eF95c78dD0E9b746a5CEc8aa52eb662D",
      identifierKind: "Ethereum",
    },
    {
      identifier: "0x0253E6e0cF5a54471176390c1447C33BC124AF2B",
      identifierKind: "Ethereum",
    },
  ];

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("No Ethereum provider found. Please install MetaMask.");
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setWalletConnected(true);
      toast.success(`Wallet connected: ${address}`);
      return signer;
    } catch (err) {
      console.error("Error connecting wallet:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      toast.error(errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const initializeClient = async () => {
    setIsLoading(true);
    setError(null);
    const loadingToast = toast.loading("Initializing XMTP client...");

    try {
      const ethersSigner = await connectWallet();
      const address = await ethersSigner.getAddress();

      const xmtpSigner: Signer = {
        type: "EOA",
        getIdentifier: () => ({
          identifier: address,
          identifierKind: "Ethereum",
        }),
        signMessage: async (message: string) => {
          const signature = await ethersSigner.signMessage(message);
          return ethers.getBytes(signature);
        },
      };

      const xmtpClient = await Client.create(xmtpSigner, {
        env: "dev",
      });
      setClient(xmtpClient);

      // Check reachability
      const reachabilityResult = await Client.canMessage(identities);
      setResult(reachabilityResult);

      // List conversations
      const convs = await xmtpClient.conversations.list();
      setConversations(convs);

      toast.success("XMTP client initialized successfully!", {
        id: loadingToast,
      });
      return xmtpClient;
    } catch (err) {
      console.error("Error initializing client:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize client";
      toast.error(errorMessage, { id: loadingToast });
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckReachability = async () => {
    await initializeClient();
  };

  const startConversation = async (peerAddress: string) => {
    if (!client) {
      toast.error("XMTP client not initialized");
      return;
    }

    // Ensure proper address formatting
    let formattedAddress;
    try {
      formattedAddress = ethers.getAddress(peerAddress.toLowerCase());
    } catch (e) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    const loadingToast = toast.loading("Starting conversation...");

    try {
      setIsLoading(true);

      // Check for existing conversation first
      const existingConv = conversations.find(
        (c) => ethers.getAddress(c.peerAddress) === formattedAddress
      );

      if (existingConv) {
        setActiveConversation(formattedAddress);
        await loadMessages(existingConv);
        toast.success(`Resumed existing conversation`, { id: loadingToast });
        return;
      }

      // Create a new DM conversation
      const conversation = await client.conversations.newDm(formattedAddress);

      setActiveConversation(formattedAddress);
      setConversations((prev) => [...prev, conversation]);
      await loadMessages(conversation);

      toast.success(`Conversation started!`, { id: loadingToast });
    } catch (err) {
      console.error("Error starting conversation:", err);

      let errorMsg = "Failed to start conversation";
      if (err instanceof Error) {
        if (err.message.includes("hexadecimal")) {
          errorMsg = "Invalid address format - please check the recipient";
        } else if (err.message.includes("not found")) {
          errorMsg = "Recipient not on XMTP network";
        } else {
          errorMsg = err.message;
        }
      }

      toast.error(errorMsg, { id: loadingToast });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = useCallback(
    async (conversation: any) => {
      if (!conversation || !client) return;

      try {
        const messages = await client.conversations.list();
        setMessages(
          messages.map((msg: any) => ({
            content: msg.content,
            sender: msg.senderAddress,
          }))
        );
        toast.success("Messages loaded");
      } catch (err) {
        console.error("Error loading messages:", err);
        toast.error("Failed to load messages");
        setError("Failed to load messages");
      }
    },
    [client]
  ); // Add all dependencies used inside the callback
  const sendMessage = async () => {
    if (!client || !activeConversation || !newMessage.trim()) return;

    const loadingToast = toast.loading("Sending message...");
    try {
      setIsLoading(true);
      const conversation = await client.conversations.newDm(activeConversation);
      await conversation.send(newMessage);

      // Refresh messages
      await loadMessages(conversation);
      setNewMessage("");
      toast.success("Message sent!", { id: loadingToast });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message", { id: loadingToast });
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (client && activeConversation) {
      const conversation = conversations.find(
        (c) => c.peerAddress === activeConversation
      );
      if (conversation) {
        loadMessages(conversation);
      }
    }
  }, [activeConversation, client, conversations, loadMessages]);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-black rounded-lg shadow-md">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3B82F6",
              secondary: "#fff",
            },
          },
        }}
      />

      <h2 className="text-2xl font-bold text-white mb-4">XMTP Messenger</h2>

      <div className="mb-4 p-3 bg-blue-900 text-blue-100 rounded-md text-sm">
        <p className="font-medium">Wallet Status:</p>
        {walletConnected ? (
          <p className="mt-1 truncate">
            Connected: <span className="font-mono">{walletAddress}</span>
          </p>
        ) : (
          <p className="mt-1">Not connected</p>
        )}
      </div>

      <button
        onClick={handleCheckReachability}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors mb-6 ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
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
            {walletConnected ? "Initializing..." : "Connect & Initialize"}
          </span>
        ) : walletConnected ? (
          "Initialize XMTP Client"
        ) : (
          "Connect Wallet & Initialize"
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-900 text-red-100 rounded-md border border-red-700 mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          {error.includes("MetaMask") && (
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-300 hover:underline"
            >
              Install MetaMask
            </a>
          )}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Reachable Contacts
              </h3>
              <ul className="space-y-2">
                {Array.from(result.entries()).map(([identity, isReachable]) => (
                  <li key={identity}>
                    <button
                      onClick={() => startConversation(identity)}
                      disabled={!isReachable || isLoading}
                      className={`w-full text-left py-2 px-3 rounded border ${
                        !isReachable
                          ? "border-gray-600 text-gray-500 cursor-not-allowed"
                          : activeConversation === identity
                          ? "border-blue-500 bg-blue-900 text-white"
                          : "border-gray-700 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm truncate">
                          {identity}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isReachable
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {isReachable ? "Reachable" : "Not reachable"}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {conversations.length > 0 && (
              <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Your Conversations
                </h3>
                <ul className="space-y-2">
                  {conversations.map((conversation, index) => (
                    <li key={conversation.peerAddress || index}>
                      <button
                        onClick={() => {
                          setActiveConversation(conversation.peerAddress);
                          loadMessages(conversation);
                        }}
                        className={`w-full text-left py-2 px-3 rounded border ${
                          activeConversation === conversation.peerAddress
                            ? "border-blue-500 bg-blue-900 text-white"
                            : "border-gray-700 hover:bg-gray-700 text-gray-300"
                        }`}
                      >
                        <span className="font-mono text-sm">
                          {conversation.peerAddress}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {activeConversation ? (
              <div className="flex flex-col h-full">
                <div className="p-4 bg-gray-800 rounded-md border border-gray-700 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Chat with{" "}
                    <span className="font-mono text-blue-300">
                      {activeConversation}
                    </span>
                  </h3>
                </div>

                <div className="flex-grow p-4 bg-gray-900 rounded-md border border-gray-700 mb-4 overflow-y-auto max-h-96">
                  {messages.length > 0 ? (
                    <ul className="space-y-4">
                      {messages.map((msg, index) => (
                        <li
                          key={index}
                          className={`flex ${
                            msg.sender === walletAddress
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                              msg.sender === walletAddress
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {msg.sender === walletAddress
                                ? "You"
                                : msg.sender}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      No messages yet. Start the conversation!
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    className={`px-4 py-2 rounded-md font-medium ${
                      isLoading || !newMessage.trim()
                        ? "bg-gray-600 cursor-not-allowed text-gray-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gray-800 rounded-md border border-gray-700 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a contact from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {client && (
        <div className="mt-6 p-4 bg-green-900 rounded-md border border-green-700">
          <h3 className="text-lg font-semibold text-green-300 mb-2">
            XMTP Client Initialized
          </h3>
          <p className="text-sm text-green-200">
            Client is ready for messaging operations. You can now:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-green-200 space-y-1">
            <li>Start new conversations</li>
            <li>Send and receive messages</li>
            <li>View your message history</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default XMTPMessenger;
