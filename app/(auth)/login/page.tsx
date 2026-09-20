import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              CL
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                ContractLens
              </h1>
              <p className="text-xs text-slate-500">
                AI Contract Intelligence
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Demo Access
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Authentication is not required for this hackathon demo.
          </p>
        </div>

        <Link
          href="/contracts"
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue to ContractLens
        </Link>

        <p className="mt-6 text-center text-xs text-slate-400">
          AI-powered contract analysis workspace
        </p>
      </div>
    </main>
  );
}