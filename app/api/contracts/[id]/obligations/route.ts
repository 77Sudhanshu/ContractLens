import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    success: true,
    contractId: id,
    obligations: [],
    message:
      "Obligations are currently provided through the ContractLens contract analysis.",
  });
}