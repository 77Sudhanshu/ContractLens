import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const contractSchema = {
  type: "object",
  properties: {
    contractType: {
      type: "string",
      description: "The type of contract or agreement.",
    },

    title: {
      type: "string",
      description: "The contract title if clearly stated.",
    },

    summary: {
      type: "string",
      description:
        "A concise 3 to 5 sentence summary of the contract.",
    },

    parties: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Legal name of the party.",
          },
          role: {
            type: "string",
            description:
              "The party's role, such as Customer, Vendor, Licensor, or Service Provider.",
          },
        },
        required: ["name", "role"],
      },
    },

    effectiveDate: {
      type: "string",
      description:
        "Contract effective/start date. Return 'Not specified' if unavailable.",
    },

    expirationDate: {
      type: "string",
      description:
        "Contract expiration/end date. Return 'Not specified' if unavailable.",
    },

    renewal: {
      type: "string",
      description:
        "Describe automatic/manual renewal terms. Return 'Not specified' if unavailable.",
    },

    paymentTerms: {
      type: "string",
      description:
        "Summarize payment amounts, schedules, invoices, or payment deadlines.",
    },

    termination: {
      type: "string",
      description:
        "Summarize termination rights, notice periods, and termination conditions.",
    },

    obligations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          party: {
            type: "string",
            description: "Party responsible for the obligation.",
          },

          obligation: {
            type: "string",
            description: "Description of the obligation.",
          },

          deadline: {
            type: "string",
            description:
              "Deadline or timing requirement. Return 'Not specified' if unavailable.",
          },

          priority: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
        },

        required: [
          "party",
          "obligation",
          "deadline",
          "priority",
        ],
      },
    },

    reviewFlags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          clause: {
            type: "string",
            description: "Name or description of the clause.",
          },

          reason: {
            type: "string",
            description:
              "Why this clause may deserve human/legal review.",
          },

          severity: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
        },

        required: [
          "clause",
          "reason",
          "severity",
        ],
      },
    },

    sourceReferences: {
      type: "array",
      description:
        "Important contract sections used to support the analysis. Only reference information actually present in the contract.",
      items: {
        type: "object",
        properties: {
          section: {
            type: "string",
            description:
              "Contract section number or heading, such as 'Section 4 — Payment Terms'.",
          },

          topic: {
            type: "string",
            description:
              "The topic supported by this source, such as Payment, Renewal, Termination, or Confidentiality.",
          },

          excerpt: {
            type: "string",
            description:
              "A short exact or near-exact excerpt from the contract that supports the analysis. Keep it concise.",
          },
        },

        required: [
          "section",
          "topic",
          "excerpt",
        ],
      },
    },
  },

  required: [
    "contractType",
    "title",
    "summary",
    "parties",
    "effectiveDate",
    "expirationDate",
    "renewal",
    "paymentTerms",
    "termination",
    "obligations",
    "reviewFlags",
    "sourceReferences",
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

    const text = body?.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Contract text is required.",
        },
        { status: 400 }
      );
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "The contract text is too short to analyze.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are ContractLens, an AI contract intelligence assistant.

Analyze the contract text below.

Your job is to extract factual information that is explicitly supported
by the contract.

IMPORTANT RULES:

1. Do not invent information.
2. If a field is not present, return "Not specified".
3. Identify all clearly stated parties.
4. Identify important dates.
5. Identify renewal terms.
6. Identify payment terms.
7. Identify termination conditions.
8. Extract meaningful obligations for each party.
9. Identify clauses that deserve human/legal review.
10. Review flags are NOT legal conclusions.
11. Do not claim that a clause is illegal or legally invalid.
12. Return only information supported by the provided contract.
13. This is contract intelligence, not legal advice.

CONTRACT TEXT:

${text}
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
    console.log(`Trying Gemini model: ${model}`);

    response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: contractSchema,
      },
    });

    if (response.text) {
      console.log(`Gemini success with model: ${model}`);
      break;
    }
  } catch (error) {
    console.error(`Gemini model ${model} failed:`, error);

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    // Stop immediately when the Gemini project quota is exhausted.
    // Trying other models will usually not help because quotas are
    // applied at the project level.
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("quota")
    ) {
      return Response.json(
        {
          success: false,
          error:
            "AI analysis is temporarily unavailable because the Gemini API quota has been reached. Please wait a little and try again.",
          code: "AI_QUOTA_EXCEEDED",
        },
        { status: 429 }
      );
    }

    lastError = error;
  }
}

if (!response?.text) {
  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed to analyze the contract.");
}

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const analysis = JSON.parse(response.text);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
  console.error("Contract analysis error:", error);

  const errorMessage =
    error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("429") ||
    errorMessage.includes("RESOURCE_EXHAUSTED") ||
    errorMessage.includes("quota")
  ) {
    return Response.json(
      {
        success: false,
        error:
          "AI analysis is temporarily unavailable because the Gemini API quota has been reached. Please wait a little and try again.",
        code: "AI_QUOTA_EXCEEDED",
      },
      { status: 429 }
    );
  }

  return Response.json(
    {
      success: false,
      error: "AI analysis could not be completed. Please try again.",
      code: "AI_ANALYSIS_FAILED",
    },
    { status: 500 }
  );
}
}