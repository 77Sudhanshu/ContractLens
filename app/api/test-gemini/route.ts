import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "❌ GEMINI_API_KEY was not found in .env.local",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Reply with exactly: ContractLens Gemini test successful",
    });

    return NextResponse.json({
      success: true,
      message: "✅ Gemini API is working!",
      response: response.text,
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    return NextResponse.json({
      success: false,
      message: "❌ Gemini API test failed.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}