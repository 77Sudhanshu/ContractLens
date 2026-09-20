import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    contracts: [],
    message:
      "Contract records are currently managed through the ContractLens demo workspace.",
  });
}