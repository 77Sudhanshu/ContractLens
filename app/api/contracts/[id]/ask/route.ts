import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const question = body?.question;
    const contractText = body?.contractText;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "A question is required.",
        },
        { status: 400 }
      );
    }

    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Contract text is required.",
        },
        { status: 400 }
      );
    }

    if (contractText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "The contract text is too short.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are ContractLens, an AI contract intelligence assistant.

Answer the user's question using ONLY the contract text provided below.

IMPORTANT RULES:

1. Use only information supported by the contract.
2. Do not invent facts.
3. If the contract does not contain enough information to answer the question, clearly say:
   "The contract does not specify this."
4. Give a concise and easy-to-understand answer.
5. When useful, mention the relevant clause or section.
6. Do not provide legal advice.
7. Do not claim that a clause is legal or illegal.
8. Do not make assumptions about what the parties intended.
9. Treat the contract text as the source of truth.
10. Do not use outside knowledge to fill missing information.

USER QUESTION:

${question}

CONTRACT TEXT:

${contractText}
`;

    const models = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

let response = null;
let lastError: unknown = null;

for (const model of models) {
  try {
    console.log(`Trying Ask Contract model: ${model}`);

    response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (response.text) {
      console.log(`Ask Contract succeeded with: ${model}`);
      break;
    }
  } catch (error) {
    console.error(`Ask Contract model ${model} failed:`, error);
    lastError = error;
  }
}

if (!response?.text) {
  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed to answer the question.");
}
return NextResponse.json({
  success: true,
  answer: response.text,
});

    if (!response.text) {
      throw new Error("Gemini returned an empty answer.");
    }

    return NextResponse.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    console.error("Contract Q&A error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to answer the question.",
      },
      { status: 500 }
    );
  }
}