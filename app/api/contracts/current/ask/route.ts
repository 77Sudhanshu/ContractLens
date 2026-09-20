import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const askSchema = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description:
        "A concise answer to the user's question based only on the contract.",
    },

    source: {
      type: "object",
      properties: {
        section: {
          type: "string",
          description:
            "The contract section or heading that supports the answer.",
        },

        topic: {
          type: "string",
          description:
            "The topic of the referenced section, such as Payment, Renewal, Termination, or Term.",
        },

        excerpt: {
          type: "string",
          description:
            "A short exact or near-exact excerpt from the contract supporting the answer.",
        },
      },

      required: ["section", "topic", "excerpt"],
    },
  },

  required: ["answer", "source"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const question = body.question;
    const contractText = body.contractText;

    if (!question || typeof question !== "string") {
      return Response.json(
        {
          success: false,
          error: "Question is required.",
        },
        { status: 400 }
      );
    }

    if (!contractText || typeof contractText !== "string") {
      return Response.json(
        {
          success: false,
          error: "Contract text is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are ContractLens, an AI contract analysis assistant.

Answer the user's question using ONLY the contract text provided below.

Do not invent facts.
Do not rely on outside knowledge.
If the answer cannot be found in the contract, clearly say that it is not specified.

For the source:
- Identify the most relevant contract section or heading.
- Identify the topic.
- Provide a short excerpt from the contract that supports the answer.
- The excerpt must come from the provided contract text.

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
        console.log(`Trying Gemini model: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: askSchema,
          },
        });

        if (response.text) {
          console.log(`Gemini success with model: ${model}`);
          break;
        }
      } catch (error) {
        console.error(
          `Gemini model ${model} failed:`,
          error
        );

        lastError = error;
      }
    }

    if (!response?.text) {
      throw lastError instanceof Error
        ? lastError
        : new Error(
            "All Gemini models failed to answer the question."
          );
    }

    const result = JSON.parse(response.text);

    return Response.json({
      success: true,
      answer: result.answer,
      source: result.source,
    });
  } catch (error) {
    console.error("Ask Contract API error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to answer the contract question.",
      },
      { status: 500 }
    );
  }
}