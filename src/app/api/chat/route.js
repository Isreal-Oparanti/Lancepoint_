import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    const result = await generateText({
      model: openai("gpt-4o"),
      system: `You are a senior project reviewer. Your job is to critically review freelancer gig submissions based on provided milestones, descriptions, and proof links. Offer feedback, highlight any issues, and suggest improvements if needed. and give it a rating at the end for either 1-5 star rating`,
      messages,
    });

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
