import {
  createSigner,
  getEncryptionKeyFromHex,
  validateEnvironment,
} from "@agenthub/xmtp-helpers";
// import { type XmtpEnv } from '@xmtp/node-sdk';
import BasedClient from "@agenthub/xmtp-based-client";

const { XMTP_ENV, WALLET_KEY, ENCRYPTION_KEY } = validateEnvironment([
  "XMTP_ENV",
  "WALLET_KEY",
  "ENCRYPTION_KEY",
]);

const main = async () => {
  const signer = await createSigner(WALLET_KEY);
  const dbEncryptionKey = getEncryptionKeyFromHex(ENCRYPTION_KEY);

  const client = await BasedClient.create(signer, {
    dbEncryptionKey,
    env: XMTP_ENV,
    username: "lancepoint",
    displayName: "Lancepoint Agent",
    description: "Personal assistant for Lancepoint users",
    fees: 0.0,
    tags: ["astrology"],
    chain: "baseSepolia",
  });

  await client.conversations.sync();

  // Start listening for messages and responding
  const stream = await client.conversations.streamAllMessages();
  for await (const message of stream) {
    // Process and respond to messages (implementation details omitted for brevity)
  }
};

function processMessage(messageContent) {
  return `You said: ${messageContent}`;
}

main().catch(console.error);
