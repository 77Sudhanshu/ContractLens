import "pdf-parse/worker";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  let parser: PDFParse | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // Validate file exists
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No PDF file was uploaded.",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF files are supported.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File is too large. Maximum size is 20 MB.",
        },
        { status: 400 }
      );
    }

    // Convert uploaded file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    const extractedText = result.text?.trim() || "";

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The PDF was received, but no readable text could be extracted. It may be an image-only or scanned PDF.",
        },
        { status: 422 }
      );
    }

    // Limit preview returned to browser
    const preview = extractedText.slice(0, 5000);

    return NextResponse.json({
      success: true,

      contract: {
        filename: file.name,
        size: file.size,
        type: file.type,
        characters: extractedText.length,
      },

      extraction: {
        preview,
        text: extractedText,
      },

      message: "Contract uploaded and text extracted successfully.",
    });
  } catch (error) {
    console.error("Contract upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process the contract.",
      },
      { status: 500 }
    );
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (error) {
        console.error("Failed to destroy PDF parser:", error);
      }
    }
  }
}