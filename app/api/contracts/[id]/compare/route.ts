import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const comparisonSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "A concise summary of the most important differences between the two contract versions.",
    },
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Category such as Payment, Term, Renewal, Termination, Obligation, Confidentiality, or Other.",
          },
          title: {
            type: "string",
            description: "Short name describing the change.",
          },
          oldVersion: {
            type: "string",
            description: "What the old contract says.",
          },
          newVersion: {
            type: "string",
            description: "What the new contract says.",
          },
          impact: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
        },
        required: [
          "category",
          "title",
          "oldVersion",
          "newVersion",
          "impact",
        ],
      },
    },
    addedClauses: {
      type: "array",
      items: {
        type: "string",
      },
    },
    removedClauses: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "summary",
    "changes",
    "addedClauses",
    "removedClauses",
  ],
};

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

    const oldText = body?.oldText;
    const newText = body?.newText;

    if (!oldText || typeof oldText !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Old contract text is required.",
        },
        { status: 400 }
      );
    }

    if (!newText || typeof newText !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "New contract text is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are ContractLens, an AI contract comparison assistant.

Compare the OLD contract version with the NEW contract version.

Your job is to identify factual differences between the two documents.

IMPORTANT RULES:

1. Only use information explicitly present in the two contracts.
2. Do not invent changes.
3. Do not assume that a change is legally good or bad.
4. Do not provide legal advice.
5. Clearly distinguish the old wording from the new wording.
6. Identify meaningful changes to payment, dates, renewal, termination,
   obligations, confidentiality, services, and other important clauses.
7. Identify clauses that were added.
8. Identify clauses that were removed.
9. If there are no meaningful changes in a category, do not invent one.
10. Impact describes how significant the textual/business change appears
    from the contract content; it is not a legal conclusion.
11. Keep the summary concise and easy to understand.

OLD CONTRACT:

${oldText}

NEW CONTRACT:

${newText}
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
        console.log(`Trying Contract Compare model: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: comparisonSchema,
          },
        });

        if (response.text) {
          console.log(
            `Contract Compare succeeded with: ${model}`
          );
          break;
        }
      } catch (error) {
        console.error(
          `Contract Compare model ${model} failed:`,
          error
        );

        lastError = error;
      }
    }

    if (!response?.text) {
      throw lastError instanceof Error
        ? lastError
        : new Error(
            "All Gemini models failed to compare the contracts."
          );
    }

    const comparison = JSON.parse(response.text);

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error("Contract comparison error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to compare the contract versions.",
      },
      { status: 500 }
    );
  }
}