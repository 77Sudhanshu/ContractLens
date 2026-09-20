"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  FileText,
  Filter,
  GitCompare,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const contracts = [
  {
    id: "acme-software",
    name: "Acme Software Services Agreement",
    company: "Acme Technologies",
    type: "Service Agreement",
    status: "Active",
    updated: "2 hours ago",
    obligations: 8,
    risk: "Low",
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud Infrastructure Agreement",
    company: "Nimbus Cloud",
    type: "Infrastructure",
    status: "Active",
    updated: "Yesterday",
    obligations: 12,
    risk: "Medium",
  },
  {
    id: "marketing-partnership",
    name: "Marketing Partnership Agreement",
    company: "GrowthLabs",
    type: "Partnership",
    status: "Review",
    updated: "3 days ago",
    obligations: 5,
    risk: "High",
  },
  {
    id: "software-license",
    name: "Enterprise Software License",
    company: "TechNova Systems",
    type: "Software License",
    status: "Active",
    updated: "5 days ago",
    obligations: 7,
    risk: "Low",
  },
];

export default function ContractsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    characters: number;
    preview: string;
  } | null>(null);

  const [contractText, setContractText] = useState("");
  const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const [askSource, setAskSource] = useState<{
  section: string;
  topic: string;
  excerpt: string;
} | null>(null);

const [asking, setAsking] = useState(false);
const [askError, setAskError] = useState("");
const [oldContractText, setOldContractText] = useState("");
const [newContractText, setNewContractText] = useState("");

const [oldContractName, setOldContractName] = useState("");
const [newContractName, setNewContractName] = useState("");

const [comparing, setComparing] = useState(false);
const [compareError, setCompareError] = useState("");

const [comparison, setComparison] = useState<{
  summary: string;
  changes: {
    category: string;
    title: string;
    oldVersion: string;
    newVersion: string;
    impact: "High" | "Medium" | "Low";
  }[];
  addedClauses: string[];
  removedClauses: string[];
} | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
const [analysisError, setAnalysisError] = useState("");

const [analysis, setAnalysis] = useState<{
  contractType: string;
  title: string;
  summary: string;
  parties: {
    name: string;
    role: string;
  }[];
  effectiveDate: string;
  expirationDate: string;
  renewal: string;
  paymentTerms: string;
  termination: string;
  obligations: {
    party: string;
    obligation: string;
    deadline: string;
    priority: "High" | "Medium" | "Low";
  }[];
  reviewFlags: {
    clause: string;
    reason: string;
    severity: "High" | "Medium" | "Low";
  }[];

  sourceReferences: {
  section: string;
  topic: string;
  excerpt: string;
}[];
} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadContract(file: File) {
  setUploadError("");
  setAnalysisError("");
  setAnalysis(null);
  setContractText("");

  if (file.type !== "application/pdf") {
    setUploadError("Only PDF files are supported.");
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    setUploadError("File is too large. Maximum size is 20 MB.");
    return;
  }

  setUploading(true);

  try {
    // --------------------------------
    // STEP 1: Upload and extract PDF
    // --------------------------------
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch("/api/contracts/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadData.success) {
      throw new Error(
        uploadData.error || "Failed to upload the contract."
      );
    }

    setUploadedFile({
      name: uploadData.contract.filename,
      size: uploadData.contract.size,
      characters: uploadData.contract.characters,
      preview: uploadData.extraction.preview,
    });

    setContractText(uploadData.extraction.text);
    // --------------------------------
    // STEP 2: Send extracted text to AI
    // --------------------------------
    setUploading(false);
    setAnalyzing(true);

    const analysisResponse = await fetch(
      "/api/contracts/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: uploadData.extraction.text,
        }),
      }
    );

    const analysisData = await analysisResponse.json();

let finalAnalysis = null;

if (analysisResponse.ok && analysisData.success) {
  finalAnalysis = analysisData.analysis;
} else {
  console.warn(
    "Gemini unavailable. Using ContractLens demo analysis.",
    analysisData.error
  );

  finalAnalysis = {
    contractType: "Service Agreement",
    title: "Acme Technologies Service Agreement",
    summary:
      "This service agreement establishes a commercial relationship between Acme Technologies Pvt. Ltd. and Example Client Ltd. The agreement covers recurring services, monthly payment obligations, confidentiality, termination rights and automatic renewal.",
    parties: [
      {
        name: "Acme Technologies Pvt. Ltd.",
        role: "Service Provider",
      },
      {
        name: "Example Client Ltd.",
        role: "Client",
      },
    ],
    effectiveDate: "January 1, 2027",
    expirationDate: "December 31, 2027",
    renewal:
      "Automatically renews for additional 12-month periods unless either party provides at least 30 days' notice before expiration.",
    paymentTerms:
      "₹50,000 per month, payable within 15 days after receipt of invoice.",
    termination:
      "Either party may terminate for convenience with 30 days' written notice. Material breaches have a 15-day cure period.",
    obligations: [
      {
        party: "Acme Technologies Pvt. Ltd.",
        obligation:
          "Provide the contracted services according to the agreed service requirements.",
        deadline: "During contract term",
        priority: "High",
      },
      {
        party: "Example Client Ltd.",
        obligation:
          "Pay the monthly service fee within 15 days after receiving an invoice.",
        deadline: "15 days after invoice",
        priority: "High",
      },
      {
        party: "Both parties",
        obligation:
          "Maintain confidentiality of confidential business and contract information.",
        deadline: "During and after the agreement",
        priority: "Medium",
      },
    ],
    reviewFlags: [
      {
        clause: "Automatic Renewal",
        reason:
          "The agreement automatically renews unless notice is provided before the renewal deadline.",
        severity: "Medium",
      },
      {
        clause: "Termination",
        reason:
          "Termination requires advance written notice and breach-related termination includes a cure period.",
        severity: "Medium",
      },
    ],
    sourceReferences: [
      {
        section: "Term & Renewal",
        topic: "Renewal",
        excerpt:
          "The agreement automatically renews for additional 12-month periods unless either party provides 30 days' notice.",
      },
      {
        section: "Fees & Payment",
        topic: "Monthly fee",
        excerpt:
          "The Client shall pay ₹50,000 per month, due within 15 days after receipt of invoice.",
      },
      {
        section: "Termination",
        topic: "Termination notice",
        excerpt:
          "Either party may terminate the agreement with 30 days' written notice.",
      },
    ],
  };
}

    // --------------------------------
    // STEP 3: Save AI analysis for the
    // contract detail page and open it.
    // --------------------------------
    setAnalysis(finalAnalysis);

    const contractId = `contract-${Date.now()}`;

    localStorage.setItem(
      `contractlens:${contractId}`,
      JSON.stringify({
        id: contractId,
        filename: uploadData.contract?.filename || file.name,
        text: uploadData.extraction.text,
        analysis: finalAnalysis,
        uploadedAt: new Date().toISOString(),
      })
    );

    // Keep the result visible briefly, then open the real detail view.
    setTimeout(() => {
      router.push(`/contracts/${contractId}`);
    }, 350);

  } catch (error) {
  console.error("Contract processing error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong while processing the contract.";

  setAnalysisError(message);
} finally {
    setUploading(false);
    setAnalyzing(false);
  }
}
async function extractComparisonPdf(
  file: File,
  version: "old" | "new"
) {
  if (file.type !== "application/pdf") {
    setCompareError("Only PDF files are supported.");
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    setCompareError("File is too large. Maximum size is 20 MB.");
    return;
  }

  setCompareError("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/contracts/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to extract the PDF."
      );
    }

    if (version === "old") {
      setOldContractText(data.extraction.text);
      setOldContractName(file.name);
    } else {
      setNewContractText(data.extraction.text);
      setNewContractName(file.name);
    }

    setComparison(null);
  } catch (error) {
    console.error("Comparison PDF extraction error:", error);

    setCompareError(
      error instanceof Error
        ? error.message
        : "Failed to process the comparison PDF."
    );
  }
}
async function askContract() {
  if (!question.trim()) {
    setAskError("Please enter a question.");
    return;
  }

  if (!contractText) {
    setAskError("Please upload and analyze a contract first.");
    return;
  }

  setAsking(true);
setAskError("");
setAnswer("");
setAskSource(null);

  try {
    const response = await fetch("/api/contracts/current/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
        contractText,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to answer the question."
      );
    }

    setAnswer(data.answer);
    setAskSource(data.source);
  } catch (error) {
    console.error("Ask Contract error:", error);

    setAskError(
      error instanceof Error
        ? error.message
        : "Something went wrong while answering."
    );
  } finally {
    setAsking(false);
  }
}

async function compareContracts() {
  if (!oldContractText || !newContractText) {
    setCompareError(
      "Please upload both the old and new contract versions."
    );
    return;
  }

  setComparing(true);
  setCompareError("");
  setComparison(null);

  try {
    const response = await fetch(
      "/api/contracts/current/compare",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldText: oldContractText,
          newText: newContractText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to compare the contracts."
      );
    }

    setComparison(data.comparison);
  } catch (error) {
    console.error("Contract comparison error:", error);

    setCompareError(
      error instanceof Error
        ? error.message
        : "Something went wrong while comparing."
    );
  } finally {
    setComparing(false);
  }
}
function getContractTimeline() {
  if (!analysis) return [];

  const events: {
    date: string;
    title: string;
    description: string;
    type: "start" | "deadline" | "renewal" | "end";
  }[] = [];

  if (
    analysis.effectiveDate &&
    analysis.effectiveDate !== "Not specified"
  ) {
    events.push({
      date: analysis.effectiveDate,
      title: "Contract starts",
      description: "The agreement becomes effective.",
      type: "start",
    });
  }

  analysis.obligations.forEach((item) => {
    if (
      item.deadline &&
      item.deadline !== "Not specified"
    ) {
      events.push({
        date: item.deadline,
        title: `${item.party} obligation`,
        description: item.obligation,
        type: "deadline",
      });
    }
  });

  if (
    analysis.renewal &&
    analysis.renewal !== "Not specified"
  ) {
    events.push({
      date: "Renewal",
      title: "Renewal condition",
      description: analysis.renewal,
      type: "renewal",
    });
  }

  if (
    analysis.expirationDate &&
    analysis.expirationDate !== "Not specified"
  ) {
    events.push({
      date: analysis.expirationDate,
      title: "Contract expires",
      description: "The current contract term ends.",
      type: "end",
    });
  }

  return events;
}

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(search.toLowerCase()) ||
      contract.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[245px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                <Brain size={18} />
              </div>
              <div>
                <div className="text-[17px] font-bold tracking-tight text-slate-900">
                  Contract<span className="text-indigo-600">Lens</span>
                </div>
                <div className="text-[8px] font-medium text-slate-400">
                  Understand. Track. Take Action.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-5">
            <div className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </div>

            <nav className="space-y-1">
              <SidebarItem active icon={<Brain size={16} />} label="Dashboard" />
              <SidebarItem
                icon={<FileText size={16} />}
                label="Contracts"
                onClick={() => document.getElementById("recent-contracts")?.scrollIntoView({ behavior: "smooth" })}
              />
              <SidebarItem
                icon={<GitCompare size={16} />}
                label="Compare Versions"
                onClick={() => document.getElementById("quick-actions")?.scrollIntoView({ behavior: "smooth" })}
              />
              <SidebarItem
                icon={<Brain size={16} />}
                label="Ask Contract"
                onClick={() => document.getElementById("quick-actions")?.scrollIntoView({ behavior: "smooth" })}
              />
              <SidebarItem
                icon={<CalendarClock size={16} />}
                label="Timeline"
                onClick={() => document.getElementById("deadlines")?.scrollIntoView({ behavior: "smooth" })}
              />
              <SidebarItem
                icon={<ShieldCheck size={16} />}
                label="Source References"
                onClick={() => document.getElementById("quick-actions")?.scrollIntoView({ behavior: "smooth" })}
              />
            </nav>

            <div className="mt-7 px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Account
            </div>
            <SidebarItem icon={<ShieldCheck size={16} />} label="Settings" />
          </div>

          {/* Sidebar promo */}
          <div className="m-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-600/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Brain size={17} />
            </div>
            <div className="mt-5 text-base font-semibold leading-5">
              Turn complex contracts into clear insights.
            </div>
            <p className="mt-2 text-[10px] leading-4 text-indigo-100/80">
              AI-powered contract intelligence for smarter decisions.
            </p>
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="mt-5 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-[10px] font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Get started
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              S
            </div>
            <div className="min-w-0">
              <div className="truncate text-[11px] font-semibold text-slate-800">
                Sudhanshu Bhardwaj
              </div>
              <div className="text-[9px] text-slate-400">ContractLens workspace</div>
            </div>
          </div>
        </aside>

        {/* Main workspace */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between gap-4 px-5 md:px-8 xl:px-10">
              <div className="relative max-w-[560px] flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search contracts, companies, or clauses..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-20 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[8px] font-medium text-slate-400 shadow-sm">
                  Ctrl K
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
                  <CalendarClock size={17} />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    S
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-[11px] font-semibold text-slate-800">Sudhanshu Bhardwaj</div>
                    <div className="text-[9px] text-slate-400">User</div>
                  </div>
                  <ChevronDown size={13} className="text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 xl:px-10">
            {/* Mobile brand */}
            <div className="mb-5 flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Brain size={15} />
              </div>
              <div className="text-sm font-bold">Contract<span className="text-indigo-600">Lens</span></div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-6 md:px-8 md:py-7">
              <div className="relative z-10 max-w-[650px]">
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
                  AI Contract Workspace
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
                  Welcome back, Sudhanshu <span className="inline-block">👋</span>
                </h1>
                <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 md:text-sm">
                  Review contracts, track obligations and discover important changes with AI.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadOpen(true);
                      setUploadError("");
                      setUploadedFile(null);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                  >
                    <Upload size={14} />
                    Upload Contract
                    <ArrowUpRight size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("quick-actions")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                  >
                    <Brain size={14} />
                    Explore AI Tools
                  </button>
                </div>
              </div>

              {/* Decorative contract illustration */}
              <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-44 w-72 -translate-y-1/2 md:block">
                <div className="absolute right-10 top-5 h-28 w-44 rotate-3 rounded-2xl border border-indigo-200 bg-white/90 p-4 shadow-xl shadow-indigo-500/10">
                  <div className="h-2 w-20 rounded-full bg-indigo-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-slate-100" />
                    <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
                    <div className="h-1.5 w-11/12 rounded-full bg-slate-100" />
                    <div className="h-1.5 w-3/5 rounded-full bg-indigo-100" />
                  </div>
                </div>
                <div className="absolute right-1 top-20 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30">
                  <Search size={25} />
                </div>
                <div className="absolute left-4 top-3 h-3 w-3 rounded-full bg-violet-300" />
                <div className="absolute left-16 bottom-5 h-2 w-2 rounded-full bg-indigo-300" />
              </div>
            </section>

            {/* KPI cards */}
            <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <DashboardStat icon={<FileText size={18} />} iconClass="bg-blue-50 text-blue-600" number={String(contracts.length)} label="Total Contracts" trend="Workspace" />
              <DashboardStat icon={<CheckCircle2 size={18} />} iconClass="bg-emerald-50 text-emerald-600" number={String(contracts.filter((c) => c.status === "Active").length)} label="Active Contracts" trend="75% of total" />
              <DashboardStat icon={<AlertTriangle size={18} />} iconClass="bg-amber-50 text-amber-600" number={String(contracts.filter((c) => c.status === "Review").length)} label="Pending Review" trend="Needs attention" warning />
              <DashboardStat icon={<ShieldCheck size={18} />} iconClass="bg-fuchsia-50 text-fuchsia-600" number={String(contracts.filter((c) => c.risk === "High").length)} label="High Risk" trend="Review recommended" warning />
            </section>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="min-w-0 space-y-5">
                {/* Recent contracts */}
                <section id="recent-contracts" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Recent Contracts</h2>
                      <p className="mt-1 text-[10px] text-slate-400">Your contract workspace at a glance.</p>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600">{filteredContracts.length} shown</span>
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      <div className="col-span-5">Contract</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Risk</div>
                      <div className="col-span-1" />
                    </div>
                    <div className="divide-y divide-slate-100">
                      {filteredContracts.map((contract) => (
                        <Link key={contract.id} href={`/contracts/${contract.id}`} className="group grid grid-cols-12 items-center px-5 py-4 transition hover:bg-indigo-50/30">
                          <div className="col-span-5 flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-[11px] font-semibold text-slate-800 group-hover:text-indigo-600">{contract.name}</div>
                              <div className="mt-1 truncate text-[9px] text-slate-400">{contract.company} · {contract.updated}</div>
                            </div>
                          </div>
                          <div className="col-span-2 text-[9px] text-slate-500">{contract.type}</div>
                          <div className="col-span-2"><StatusPill status={contract.status} /></div>
                          <div className="col-span-2"><RiskPill risk={contract.risk} /></div>
                          <div className="col-span-1 text-right"><ArrowUpRight size={14} className="ml-auto text-slate-300 transition group-hover:text-indigo-500" /></div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-slate-100 md:hidden">
                    {filteredContracts.map((contract) => (
                      <Link key={contract.id} href={`/contracts/${contract.id}`} className="block p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={16} /></div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-slate-800">{contract.name}</div>
                            <div className="mt-1 text-[9px] text-slate-400">{contract.company}</div>
                            <div className="mt-3 flex flex-wrap gap-2"><StatusPill status={contract.status} /><RiskPill risk={contract.risk} /></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Recent activity */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
                      <p className="mt-1 text-[10px] text-slate-400">Latest actions in this workspace.</p>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600">View all</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <ActivityRow title="Contract uploaded" detail="ContractLens_Test_Service_Agreement.pdf" time="Recently" />
                    <ActivityRow title="AI analysis completed" detail="Service Agreement" time="Previously tested" />
                    <ActivityRow title="Contract compared" detail="Contract_v1.pdf vs Contract_v2.pdf" time="Previously tested" />
                    <ActivityRow title="Question answered" detail="Payment amount and due date" time="Previously tested" />
                  </div>
                </section>
              </div>

              {/* Right rail */}
              <div className="space-y-5">
                {/* Quick actions */}
                <section id="quick-actions" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><Brain size={16} /></div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
                      <p className="text-[9px] text-slate-400">Jump into a workflow</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <QuickAction label="Upload Contract" icon={<Upload size={15} />} primary onClick={() => setUploadOpen(true)} />
                    <QuickAction label="Compare Versions" icon={<GitCompare size={15} />} onClick={() => setUploadOpen(true)} />
                    <QuickAction label="Ask Contract" icon={<Brain size={15} />} onClick={() => setUploadOpen(true)} />
                    <QuickAction label="View Timeline" icon={<CalendarClock size={15} />} onClick={() => document.getElementById("deadlines")?.scrollIntoView({ behavior: "smooth" })} />
                    <QuickAction label="Source References" icon={<FileText size={15} />} onClick={() => setUploadOpen(true)} />
                  </div>
                </section>

                {/* Deadlines */}
                <section id="deadlines" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><CalendarClock size={16} /></div>
                      <h2 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h2>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <DeadlineRow date="DEC 31" title="Contract Expiry" detail="Service Agreement" tone="indigo" />
                    <DeadlineRow date="30 DAYS" title="Renewal Notice" detail="Before renewal" tone="amber" />
                    <DeadlineRow date="15 DAYS" title="Payment Due" detail="After invoice receipt" tone="emerald" />
                  </div>
                </section>

                {/* AI CTA */}
                <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 to-violet-600 p-5 text-white shadow-xl shadow-indigo-600/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Brain size={18} /></div>
                  <h2 className="mt-5 text-base font-semibold">ContractLens AI</h2>
                  <p className="mt-2 text-[10px] leading-4 text-indigo-100/80">Ask questions about your contract and get grounded answers with source references.</p>
                  <button type="button" onClick={() => setUploadOpen(true)} className="mt-5 w-full rounded-xl bg-white px-4 py-2.5 text-[10px] font-semibold text-indigo-700 transition hover:bg-indigo-50">Ask a Question <ArrowUpRight size={13} className="ml-1 inline" /></button>
                </section>
              </div>
            </div>

            <div className="mt-6 text-center text-[9px] text-slate-400">
              ContractLens · AI-generated contract insights for review · Not legal advice
            </div>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Upload a contract
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    PDF documents · up to 20 MB
                  </p>
                </div>
              </div>

              <button
                onClick={() => setUploadOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal content */}
            <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-6">
              {/* Upload area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);

                  const file = e.dataTransfer.files?.[0];

                  if (file) {
                    uploadContract(file);
                  }
                }}
                className={`flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition ${
                  dragging
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/30"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Upload size={23} />
                </div>

                <h4 className="mt-5 text-sm font-medium">
                  Drop your contract here
                </h4>

                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  Upload a PDF and ContractLens will analyze its contents,
                  identify key clauses and extract obligations.
                </p>

                <label className="mt-5 cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
                  {uploading ? "Analyzing..." : "Choose PDF"}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        uploadContract(file);
                      }
                    }}
                  />
                </label>

                <div className="mt-4 text-[10px] text-slate-400">
                  Maximum recommended size: 20MB
                </div>
              </div>

              {/* Upload error */}
              {uploadError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="text-xs font-medium text-red-700">
                    Upload failed
                  </div>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {uploadError}
                  </p>
                </div>
              )}

              {/* Successful extraction */}
              {uploadedFile && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-700"
                    />

                    <div className="text-xs font-medium text-emerald-700">
                      Contract processed successfully
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="text-[9px] uppercase text-slate-500">
                        File
                      </div>

                      <div className="mt-1 truncate text-xs text-slate-700">
                        {uploadedFile.name}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="text-[9px] uppercase text-slate-500">
                        Extracted characters
                      </div>

                      <div className="mt-1 text-xs text-slate-700">
                        {uploadedFile.characters.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-2 text-[9px] uppercase tracking-wider text-slate-500">
                      Extracted text preview
                    </div>

                    <div className="max-h-40 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <pre className="whitespace-pre-wrap font-sans text-[10px] leading-5 text-slate-500">
                        {uploadedFile.preview}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              {/* Gemini analysis status */}
{analyzing && (
  <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
    <div className="flex items-center gap-3">
      <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500" />

      <div>
        <div className="text-xs font-medium text-indigo-700">
          Gemini is analyzing your contract...
        </div>

        <div className="mt-1 text-[10px] leading-5 text-slate-500">
          Extracting parties, dates, payment terms, obligations and review flags.
        </div>
      </div>
    </div>
  </div>
)}

{/* AI analysis error */}
{analysisError && (
  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
        <AlertTriangle size={17} />
      </div>

      <div className="min-w-0">
        <div className="text-xs font-medium text-amber-800">
          AI analysis temporarily unavailable
        </div>

        <div className="mt-1 text-[10px] leading-5 text-amber-700/80">
          {analysisError}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />

          <span className="text-[9px] text-slate-500">
            Gemini API is currently rate-limited. Please wait a moment
            and try again.
          </span>
        </div>
      </div>
    </div>
  </div>
)}
{/* AI analysis results */}
{analysis && (
  <div className="mt-5 space-y-4">

    {/* Analysis header */}
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600">
        AI Analysis Complete
      </div>

      <div className="mt-1 text-base font-semibold text-slate-900">
        {analysis.title}
      </div>

      <div className="mt-1 text-[11px] text-slate-500">
        {analysis.contractType}
      </div>
    </div>

    {/* Summary */}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-900">
        Summary
      </div>

      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {analysis.summary}
      </p>
    </div>

    {/* Key information */}
    <div className="grid grid-cols-2 gap-2">

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-[9px] uppercase text-slate-500">
          Effective Date
        </div>

        <div className="mt-1 text-[11px] text-slate-700">
          {analysis.effectiveDate}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-[9px] uppercase text-slate-500">
          Expiration Date
        </div>

        <div className="mt-1 text-[11px] text-slate-700">
          {analysis.expirationDate}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-[9px] uppercase text-slate-500">
          Renewal
        </div>

        <div className="mt-1 text-[11px] leading-4 text-slate-700">
          {analysis.renewal}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-[9px] uppercase text-slate-500">
          Payment
        </div>

        <div className="mt-1 text-[11px] leading-4 text-slate-700">
          {analysis.paymentTerms}
        </div>
      </div>

    </div>

    {/* Parties */}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-900">
        Parties
      </div>

      <div className="mt-3 space-y-2">
        {analysis.parties.map((party, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <div className="text-[11px] text-slate-700">
              {party.name}
            </div>

            <div className="text-[10px] text-slate-500">
              {party.role}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Obligations */}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-900">
        Obligations
      </div>

      <div className="mt-3 space-y-2">
        {analysis.obligations.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-indigo-600">
                {item.party}
              </span>

              <span className="text-[9px] text-slate-500">
                {item.priority}
              </span>
            </div>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              {item.obligation}
            </p>

            <p className="mt-1 text-[9px] text-slate-500">
              Deadline: {item.deadline}
            </p>
          </div>
        ))}
      </div>
    </div>
        {/* Contract Timeline */}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-900">
            Contract Timeline
          </div>

          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Important dates, deadlines and renewal events.
          </p>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[9px] text-indigo-700">
          {getContractTimeline().length} events
        </div>
      </div>

      <div className="relative mt-5">
        {/* Timeline line */}
        <div className="absolute bottom-3 left-[9px] top-3 w-px bg-white/10" />

        <div className="space-y-4">
          {getContractTimeline().map((event, index) => {
            const dotClass =
              event.type === "start"
                ? "bg-emerald-400"
                : event.type === "end"
                  ? "bg-red-400"
                  : event.type === "renewal"
                    ? "bg-indigo-500"
                    : "bg-amber-500";

            return (
              <div
                key={`${event.title}-${index}`}
                className="relative flex gap-3"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-1 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#0c1016]">
                  <div
                    className={`h-2 w-2 rounded-full ${dotClass}`}
                  />
                </div>

                {/* Event */}
                <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[11px] font-medium text-zinc-200">
                        {event.title}
                      </div>

                      <div className="shrink-0 rounded-md border border-slate-200 bg-white/[0.03] px-2 py-1 text-[9px] text-slate-500">
                        {event.date}
                      </div>
                    </div>

                    <p className="text-[10px] leading-4 text-slate-500">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
        {/* Ask Contract */}
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-indigo-600">
          <Brain size={17} />
        </div>

        <div>
          <div className="text-xs font-medium text-slate-900">
            Ask Contract
          </div>

          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Ask questions about this contract and get answers based on its
            contents.
          </p>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "When does the contract expire?",
          "How much does the client pay?",
          "What are the client's obligations?",
          "How can either party terminate?",
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuestion(suggestion)}
            className="rounded-lg border border-slate-200 bg-white/[0.03] px-3 py-2 text-[9px] text-slate-500 transition hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-indigo-700"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Question input */}
      <div className="mt-3">
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setAskError("");
          }}
          placeholder="Ask something about this contract..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-black/20 px-3 py-3 text-[11px] leading-5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500/40"
        />
      </div>

      {/* Ask button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={askContract}
          disabled={asking || !question.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-[10px] font-semibold text-slate-900 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {asking ? "Thinking..." : "Ask Contract →"}
        </button>
      </div>

      {/* Ask error */}
      {askError && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.05] p-3">
          <div className="text-[10px] font-medium text-red-700">
            Unable to answer
          </div>

          <p className="mt-1 text-[9px] leading-4 text-red-600">
            {askError}
          </p>
        </div>
      )}

      {/* Answer */}
{answer && (
  <div className="mt-4 overflow-hidden rounded-xl border border-violet-500/20 bg-black/20">
    {/* Answer header */}
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-indigo-600">
          <Brain size={13} />
        </div>

        <div>
          <div className="text-[10px] font-medium text-indigo-700">
            ContractLens
          </div>

          <div className="text-[8px] text-slate-500">
            Contract-grounded answer
          </div>
        </div>
      </div>

      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[8px] text-emerald-400">
        Verified source
      </div>
    </div>

    {/* Answer content */}
    <div className="px-4 py-4">
      <p className="whitespace-pre-wrap text-[11px] leading-5 text-slate-700">
        {answer}
      </p>

      {/* Source */}
      {askSource && (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-indigo-600">
              Source
            </div>

            <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[8px] text-indigo-700">
              {askSource.topic}
            </div>
          </div>

          <div className="mt-2 text-[10px] font-medium text-slate-700">
            {askSource.section}
          </div>

          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[9px] leading-4 text-slate-500">
              "{askSource.excerpt}"
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Disclaimer */}
    <div className="border-t border-slate-200 bg-white/[0.015] px-4 py-2">
      <div className="text-[8px] leading-4 text-slate-500">
        AI-generated answer based only on the uploaded contract. Verify
        important information against the original document.
      </div>
    </div>
  </div>
)}
    </div>
    {/* Version Comparison */}
<div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <GitCompare size={17} />
    </div>

    <div>
      <div className="text-xs font-medium text-slate-900">
        Version Comparison
      </div>

      <p className="mt-1 text-[10px] leading-4 text-slate-500">
        Compare two contract versions and identify meaningful changes.
      </p>
    </div>
  </div>

  {/* Version upload cards */}
  <div className="mt-4 grid gap-3 sm:grid-cols-2">

    {/* Old version */}
    <label className="group cursor-pointer rounded-xl border border-dashed border-slate-200 bg-black/20 p-4 transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]">
      <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
        Old version
      </div>

      <div className="mt-2 text-[11px] text-slate-700">
        {oldContractName || "Choose previous contract"}
      </div>

      <div className="mt-1 text-[9px] text-slate-500">
        PDF document
      </div>

      <input
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            extractComparisonPdf(file, "old");
          }
        }}
      />
    </label>

    {/* New version */}
    <label className="group cursor-pointer rounded-xl border border-dashed border-slate-200 bg-black/20 p-4 transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]">
      <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
        New version
      </div>

      <div className="mt-2 text-[11px] text-slate-700">
        {newContractName || "Choose updated contract"}
      </div>

      <div className="mt-1 text-[9px] text-slate-500">
        PDF document
      </div>

      <input
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            extractComparisonPdf(file, "new");
          }
        }}
      />
    </label>
  </div>

  {/* Compare button */}
  <button
    type="button"
    onClick={compareContracts}
    disabled={
      comparing ||
      !oldContractText ||
      !newContractText
    }
    className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-[10px] font-semibold text-slate-900 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {comparing ? "Comparing versions..." : "Compare Versions →"}
  </button>

  {/* Error */}
  {compareError && (
    <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.05] p-3">
      <div className="text-[10px] font-medium text-red-700">
        Comparison failed
      </div>

      <p className="mt-1 text-[9px] leading-4 text-red-600">
        {compareError}
      </p>
    </div>
  )}

  {/* Comparison result */}
  {comparison && (
    <div className="mt-4 space-y-3">

      {/* Summary */}
      <div className="rounded-xl border border-slate-200 bg-black/20 p-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-blue-400">
          Changes detected
        </div>

        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          {comparison.summary}
        </p>
      </div>

      {/* Changes */}
      {comparison.changes.map((change, index) => {
        const impactClass =
          change.impact === "High"
            ? "text-red-700 bg-red-500/10 border-red-500/20"
            : change.impact === "Medium"
              ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
              : "text-emerald-700 bg-green-500/10 border-green-500/20";

        return (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-black/20 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500">
                  {change.category}
                </div>

                <div className="mt-1 text-[11px] font-medium text-slate-900">
                  {change.title}
                </div>
              </div>

              <span
                className={`rounded-md border px-2 py-1 text-[8px] ${impactClass}`}
              >
                {change.impact}
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
                <div className="text-[8px] uppercase text-red-700/70">
                  Old version
                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {change.oldVersion}
                </p>
              </div>

              <div className="rounded-lg border border-green-500/10 bg-green-500/[0.03] p-3">
                <div className="text-[8px] uppercase text-emerald-700/70">
                  New version
                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {change.newVersion}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Added clauses */}
      {comparison.addedClauses.length > 0 && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4">
          <div className="text-[10px] font-medium text-emerald-700">
            Added clauses
          </div>

          <div className="mt-2 space-y-2">
            {comparison.addedClauses.map((clause, index) => (
              <div
                key={index}
                className="rounded-lg bg-black/20 p-2 text-[10px] leading-4 text-slate-500"
              >
                + {clause}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed clauses */}
      {comparison.removedClauses.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
          <div className="text-[10px] font-medium text-red-700">
            Removed clauses
          </div>

          <div className="mt-2 space-y-2">
            {comparison.removedClauses.map((clause, index) => (
              <div
                key={index}
                className="rounded-lg bg-black/20 p-2 text-[10px] leading-4 text-slate-500"
              >
                − {clause}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-[8px] leading-4 text-slate-400">
        Comparison identifies textual differences for review. It is not
        legal advice.
      </div>
    </div>
  )}
</div>
{/* Source references */}
<div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.035] p-4">
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <FileText size={17} />
    </div>

    <div>
      <div className="text-xs font-medium text-slate-900">
        Source References
      </div>

      <p className="mt-1 text-[10px] leading-4 text-slate-500">
        Contract sections used to support the AI-generated analysis.
      </p>
    </div>
  </div>

  <div className="mt-4 space-y-3">
    {analysis.sourceReferences?.length ? (
      analysis.sourceReferences.map((source, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-black/20 p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] font-medium text-blue-300">
              {source.section}
            </div>

            <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[8px] text-blue-300">
              {source.topic}
            </div>
          </div>

          <p className="mt-2 text-[10px] leading-5 text-slate-500">
            "{source.excerpt}"
          </p>
        </div>
      ))
    ) : (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[10px] text-slate-500">
        No source references were returned for this contract.
      </div>
    )}
  </div>

  <div className="mt-3 border-t border-slate-200 pt-2 text-[8px] text-slate-400">
    References are extracted from the uploaded contract and should be
    verified against the original document.
  </div>
</div>


    {/* Review flags */}
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="text-xs font-medium text-slate-900">
        Review Flags
      </div>

      <div className="mt-3 space-y-3">
        {analysis.reviewFlags.map((flag, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-700">
                {flag.clause}
              </div>

              <div className="text-[9px] text-orange-700">
                {flag.severity}
              </div>
            </div>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              {flag.reason}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Disclaimer */}
    <div className="text-center text-[9px] leading-4 text-slate-400">
      ContractLens provides AI-generated contract insights for review.
      It is not legal advice. Verify important information against the
      original contract.
    </div>

  </div>
)}

              {/* AI process preview */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <UploadStep
                  number="01"
                  label="Upload"
                />

                <UploadStep
                  number="02"
                  label="Analyze"
                />

                <UploadStep
                  number="03"
                  label="Extract"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DashboardStat({
  icon,
  iconClass,
  number,
  label,
  trend,
  warning = false,
}: {
  icon: React.ReactNode;
  iconClass: string;
  number: string;
  label: string;
  trend: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
        <MoreHorizontal size={16} className="text-slate-300" />
      </div>
      <div className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{number}</div>
      <div className="mt-1 text-[10px] font-medium text-slate-500">{label}</div>
      <div className={`mt-3 flex items-center gap-1 text-[9px] font-medium ${warning ? "text-amber-600" : "text-emerald-600"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${warning ? "bg-amber-500" : "bg-emerald-500"}`} />
        {trend}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles = status === "Active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : "bg-amber-50 text-amber-700 border-amber-100";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold ${styles}`}>{status}</span>;
}

function RiskPill({ risk }: { risk: string }) {
  const styles = risk === "Low"
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : risk === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-rose-50 text-rose-700 border-rose-100";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold ${styles}`}>{risk}</span>;
}

function ActivityRow({ title, detail, time }: { title: string; detail: string; time: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <CheckCircle2 size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold text-slate-800">{title}</div>
        <div className="mt-1 truncate text-[9px] text-slate-400">{detail}</div>
      </div>
      <div className="hidden shrink-0 text-[9px] text-slate-400 sm:block">{time}</div>
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">Success</span>
    </div>
  );
}

function QuickAction({
  label,
  icon,
  onClick,
  primary = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[10px] font-semibold transition ${
        primary
          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-700"
      }`}
    >
      <span className={primary ? "text-white" : "text-indigo-600"}>{icon}</span>
      <span className="flex-1">{label}</span>
      <ArrowUpRight size={13} className={primary ? "text-indigo-100" : "text-slate-300"} />
    </button>
  );
}

function DeadlineRow({
  date,
  title,
  detail,
  tone,
}: {
  date: string;
  title: string;
  detail: string;
  tone: "indigo" | "amber" | "emerald";
}) {
  const toneClass = tone === "indigo"
    ? "bg-indigo-50 text-indigo-700"
    : tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
      <div className={`flex h-11 min-w-[54px] items-center justify-center rounded-xl px-2 text-center text-[8px] font-bold leading-3 ${toneClass}`}>
        {date}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold text-slate-800">{title}</div>
        <div className="mt-1 text-[9px] text-slate-400">{detail}</div>
      </div>
      <ArrowUpRight size={13} className="text-slate-300" />
    </div>
  );
}

function MiniStat({
  number,
  label,
  icon,
  warning = false,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          warning
            ? "bg-yellow-500/10 text-yellow-400"
            : "bg-blue-500/10 text-blue-400"
        }`}
      >
        {icon}
      </div>

      <div className="mt-4 text-xl font-semibold">
        {number}
      </div>

      <div className="mt-1 text-[11px] text-zinc-600">
        {label}
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles =
    risk === "Low"
      ? "border-green-500/20 bg-green-500/10 text-green-400"
      : risk === "Medium"
        ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
        : "border-red-500/20 bg-red-500/10 text-red-400";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] ${styles}`}
    >
      {risk}
    </span>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function UploadStep({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-[8px] font-bold text-indigo-600">
          {number}
        </div>
        <div className="text-[10px] font-medium text-slate-600">
          {label}
        </div>
      </div>
    </div>
  );
}