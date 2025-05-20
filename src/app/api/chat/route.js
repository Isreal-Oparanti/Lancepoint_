import { AgentKit } from "@coinbase/agentkit";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, walletAddress } = body;

    const agentKit = await AgentKit.from({
      walletProvider: {
        type: "cdp",
        apiKeyName: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
        apiKeyPrivateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        walletAddress: walletAddress,
      },
      actionProviders: [],
    });

    const tools = await getVercelAITools(agentKit);

    const systemMessage = {
      role: "system",
      content: `You are a senior on-chain project reviewer. Your job is to:
      1. Critically review freelancer gig submissions based on milestones, descriptions, and proof links
      2. Verify on-chain data when available (transactions, NFT proofs, etc.)
      3. Offer feedback, highlight any issues, and suggest improvements
      4. Provide a 1-5 star rating at the end
      5. If requested, you can help submit reviews or ratings on-chain`,
    };

    const openRouterMessages = [systemMessage, ...messages];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: openRouterMessages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const result = await response.json();
    const generatedText = result.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({
        text: generatedText,
        toolResults: [],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
