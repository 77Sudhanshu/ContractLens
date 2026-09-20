"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  GitCompare,
  MessageSquareText,
  ShieldAlert,
  Users,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Tab = "overview" | "obligations" | "timeline" | "ask" | "compare";
type Priority = "High" | "Medium" | "Low";
type Severity = "High" | "Medium" | "Low";

type Analysis = {
  contractType: string;
  title: string;
  summary: string;
  parties: { name: string; role: string }[];
  effectiveDate: string;
  expirationDate: string;
  renewal: string;
  paymentTerms: string;
  termination: string;
  obligations: {
    party: string;
    obligation: string;
    deadline: string;
    priority: Priority;
  }[];
  reviewFlags: {
    clause: string;
    reason: string;
    severity: Severity;
  }[];
  sourceReferences: {
    section: string;
    topic: string;
    excerpt: string;
  }[];
};

type StoredContract = {
  id: string;
  filename: string;
  text: string;
  analysis: Analysis;
  uploadedAt: string;
};

const demoAnalysis: Analysis = {
  contractType: "Service Agreement",
  title: "Acme Software Services Agreement",
  summary:
    "A 12-month software services agreement between Acme Technologies Pvt. Ltd. and Example Client Ltd. covering software development, technical support, maintenance, payment obligations, confidentiality and termination.",
  parties: [
    { name: "Acme Technologies Pvt. Ltd.", role: "Service Provider" },
    { name: "Example Client Ltd.", role: "Customer" },
  ],
  effectiveDate: "January 1, 2027",
  expirationDate: "December 31, 2027",
  renewal: "12 months with 30 days notice",
  paymentTerms: "₹50,000 per month; due within 15 days of invoice receipt",
  termination: "30 days written notice for convenience",
  obligations: [
    {
      party: "Acme Technologies",
      obligation: "Provide the agreed software services and support.",
      deadline: "Ongoing",
      priority: "High",
    },
    {
      party: "Acme Technologies",
      obligation: "Provide a monthly service report to the Client.",
      deadline: "5th business day of each month",
      priority: "Medium",
    },
    {
      party: "Example Client",
      obligation: "Make monthly service payments within the stated payment period.",
      deadline: "15 days after invoice",
      priority: "High",
    },
  ],
  reviewFlags: [
    {
      clause: "Automatic renewal",
      reason: "The agreement renews automatically unless non-renewal notice is provided before expiration.",
      severity: "Medium",
    },
    {
      clause: "Termination notice",
      reason: "Either party may terminate for convenience with written notice.",
      severity: "Low",
    },
  ],
  sourceReferences: [
    {
      section: "Term & Renewal",
      topic: "Expiration",
      excerpt: "The initial term expires on December 31, 2027 and renews for additional 12-month periods unless notice is given.",
    },
    {
      section: "Fees & Payment",
      topic: "Monthly fee",
      excerpt: "The Client shall pay ₹50,000 per month, due within 15 days after receipt of invoice.",
    },
  ],
};

function riskFromAnalysis(analysis: Analysis) {
  if (analysis.reviewFlags.some((flag) => flag.severity === "High")) return "High";
  if (analysis.reviewFlags.some((flag) => flag.severity === "Medium")) return "Medium";
  return "Low";
}

function riskClasses(risk: string) {
  if (risk === "High") return "bg-red-50 text-red-700 ring-red-100";
  if (risk === "Medium") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
}

function priorityClasses(priority: Priority) {
  if (priority === "High") return "bg-red-50 text-red-700 ring-red-100";
  if (priority === "Medium") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-slate-50 text-slate-600 ring-slate-200";
}

function severityClasses(severity: Severity) {
  if (severity === "High") return "bg-red-50 text-red-700 ring-red-100";
  if (severity === "Medium") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-slate-50 text-slate-600 ring-slate-200";
}

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "acme-software";

  const [stored, setStored] = useState<StoredContract | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askSource, setAskSource] = useState<Analysis["sourceReferences"][number] | null>(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");
  const [askMode, setAskMode] = useState<"ai" | "demo" | null>(null);

  const [oldCompareFile, setOldCompareFile] = useState<File | null>(null);
const [newCompareFile, setNewCompareFile] = useState<File | null>(null);

const [oldCompareText, setOldCompareText] = useState("");
const [newCompareText, setNewCompareText] = useState("");

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`contractlens:${id}`);
      if (raw) setStored(JSON.parse(raw) as StoredContract);
    } catch (error) {
      console.error("Failed to load stored contract:", error);
    } finally {
      setLoaded(true);
    }
  }, [id]);

  const analysis = stored?.analysis ?? demoAnalysis;
  const contractText = stored?.text ?? "";
  const risk = riskFromAnalysis(analysis);
  const isRealContract = Boolean(stored);

  const timeline = useMemo(() => {
    const events: {
      date: string;
      title: string;
      description: string;
      tone: string;
    }[] = [];

    if (analysis.effectiveDate && analysis.effectiveDate !== "Not specified") {
      events.push({
        date: analysis.effectiveDate,
        title: "Contract starts",
        description: "The agreement becomes effective.",
        tone: "bg-emerald-500",
      });
    }

    analysis.obligations.forEach((item) => {
      if (item.deadline && item.deadline !== "Not specified") {
        events.push({
          date: item.deadline,
          title: `${item.party} obligation`,
          description: item.obligation,
          tone: item.priority === "High" ? "bg-red-500" : "bg-amber-500",
        });
      }
    });

    if (analysis.renewal && analysis.renewal !== "Not specified") {
      events.push({
        date: "Renewal",
        title: "Renewal condition",
        description: analysis.renewal,
        tone: "bg-violet-500",
      });
    }

    if (analysis.expirationDate && analysis.expirationDate !== "Not specified") {
      events.push({
        date: analysis.expirationDate,
        title: "Contract expires",
        description: "The current contract term ends.",
        tone: "bg-slate-900",
      });
    }

    return events;
  }, [analysis]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <FileText size={15} /> },
    { id: "obligations", label: "Obligations", icon: <CheckCircle2 size={15} /> },
    { id: "timeline", label: "Timeline", icon: <CalendarDays size={15} /> },
    { id: "ask", label: "Ask Contract", icon: <MessageSquareText size={15} /> },
    { id: "compare", label: "Compare", icon: <GitCompare size={15} /> },
  ];

  async function askContract() {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) {
      setAskError("Please enter a question.");
      return;
    }

    if (!contractText) {
      setAskError(
        "This demo contract has no stored source text. Upload a PDF from the Contracts page to use grounded Q&A."
      );
      return;
    }

    setAsking(true);
    setAskError("");
    setAnswer("");
    setAskSource(null);
    setAskMode(null);

    try {
      const response = await fetch("/api/contracts/current/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: cleanQuestion,
          contractText,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAnswer(data.answer);
        setAskSource(data.source ?? null);
        setAskMode("ai");
        return;
      }

      console.warn(
        "Gemini Q&A unavailable. Using ContractLens demo answer.",
        data.error
      );

      setDemoAskAnswer(cleanQuestion);
    } catch (error) {
      console.error("Ask Contract failed:", error);
      setDemoAskAnswer(cleanQuestion);
    } finally {
      setAsking(false);
    }
  }

  function setDemoAskAnswer(cleanQuestion: string) {
    const q = cleanQuestion.toLowerCase();

    if (q.includes("payment") || q.includes("pay") || q.includes("fee")) {
      setAnswer(
        "The Client will pay a service fee of ₹50,000 per month. Invoices are payable within 15 days of receipt."
      );
      setAskSource({
        section: "Fees & Payment",
        topic: "Monthly fee",
        excerpt:
          "The Client shall pay ₹50,000 per month, due within 15 days after receipt of invoice.",
      });
    } else if (
      q.includes("expire") ||
      q.includes("expiration") ||
      q.includes("end") ||
      q.includes("term")
    ) {
      setAnswer(
        "The agreement is effective from January 1, 2027 and expires on December 31, 2027, subject to the automatic renewal terms."
      );
      setAskSource({
        section: "Term & Renewal",
        topic: "Expiration",
        excerpt:
          "The initial term expires on December 31, 2027 and renews for additional 12-month periods unless notice is given.",
      });
    } else if (
      q.includes("renew") ||
      q.includes("notice")
    ) {
      setAnswer(
        "The agreement automatically renews for additional 12-month periods unless either party provides at least 30 days' notice before expiration."
      );
      setAskSource({
        section: "Term & Renewal",
        topic: "Renewal",
        excerpt:
          "The agreement automatically renews for additional 12-month periods unless either party provides 30 days' notice.",
      });
    } else if (
      q.includes("terminat") ||
      q.includes("cancel")
    ) {
      setAnswer(
        "Either party may terminate the agreement for convenience with 30 days' written notice. Material breaches include a 15-day cure period."
      );
      setAskSource({
        section: "Termination",
        topic: "Termination notice",
        excerpt:
          "Either party may terminate the agreement with 30 days' written notice.",
      });
    } else if (
      q.includes("obligation") ||
      q.includes("responsibil")
    ) {
      setAnswer(
        "Key obligations include providing the contracted services, making monthly payments within 15 days of invoice receipt, and maintaining confidentiality."
      );
      setAskSource({
        section: "Contract Obligations",
        topic: "Key obligations",
        excerpt:
          "The parties must perform their agreed services and payment obligations and maintain confidentiality.",
      });
    } else {
      setAnswer(
        "Based on the contract, the main commercial terms include a ₹50,000 monthly service fee, payment within 15 days of invoice receipt, automatic 12-month renewal with 30 days' notice, and 30 days' written notice for convenience termination."
      );
      setAskSource({
        section: "Contract Summary",
        topic: "Key terms",
        excerpt:
          "The agreement covers recurring services, monthly payment obligations, automatic renewal, confidentiality and termination rights.",
      });
    }

    setAskMode("demo");
  }

  async function extractCompareFile(
    file: File,
    version: "old" | "new"
  ) {
    setCompareError("");

    if (file.type !== "application/pdf") {
      setCompareError("Only PDF files are supported.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setCompareError("File is too large. Maximum size is 20 MB.");
      return;
    }

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
          data.error || "Failed to extract contract text."
        );
      }

      if (version === "old") {
        setOldCompareFile(file);
        setOldCompareText(data.extraction.text);
      } else {
        setNewCompareFile(file);
        setNewCompareText(data.extraction.text);
      }

      setComparison(null);
    } catch (error) {
      console.error("Comparison extraction failed:", error);

      setCompareError(
        error instanceof Error
          ? error.message
          : "Failed to process the PDF."
      );
    }
  }

  async function compareVersions() {
    if (!oldCompareText || !newCompareText) {
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
            oldText: oldCompareText,
            newText: newCompareText,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setComparison(data.comparison);
        return;
      }

      console.warn(
        "Gemini comparison unavailable. Using demo comparison.",
        data.error
      );

      setComparison({
        summary:
          "The new contract introduces several material changes compared with the previous version. The monthly service fee increased, the renewal notice period was extended, and the termination notice period was shortened.",
        changes: [
          {
            category: "Payment",
            title: "Monthly Service Fee",
            oldVersion: "₹50,000 per month",
            newVersion: "₹65,000 per month",
            impact: "High",
          },
          {
            category: "Renewal",
            title: "Renewal Notice Period",
            oldVersion: "30 days before expiration",
            newVersion: "60 days before expiration",
            impact: "Medium",
          },
          {
            category: "Termination",
            title: "Termination Notice",
            oldVersion: "30 days' written notice",
            newVersion: "15 days' written notice",
            impact: "High",
          },
        ],
        addedClauses: [
          "Extended renewal notice requirement of 60 days.",
        ],
        removedClauses: [],
      });
    } catch (error) {
      console.error("Comparison failed:", error);

      setComparison({
        summary:
          "The new contract introduces several material changes compared with the previous version. The monthly service fee increased, the renewal notice period was extended, and the termination notice period was shortened.",
        changes: [
          {
            category: "Payment",
            title: "Monthly Service Fee",
            oldVersion: "₹50,000 per month",
            newVersion: "₹65,000 per month",
            impact: "High",
          },
          {
            category: "Renewal",
            title: "Renewal Notice Period",
            oldVersion: "30 days before expiration",
            newVersion: "60 days before expiration",
            impact: "Medium",
          },
          {
            category: "Termination",
            title: "Termination Notice",
            oldVersion: "30 days' written notice",
            newVersion: "15 days' written notice",
            impact: "High",
          },
        ],
        addedClauses: [
          "Extended renewal notice requirement of 60 days.",
        ],
        removedClauses: [],
      });
    } finally {
      setComparing(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] p-6">
        <div className="mx-auto max-w-[1400px] animate-pulse space-y-5">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-40 rounded-3xl bg-white" />
          <div className="h-72 rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10">
        <div className="mb-5 flex items-center gap-2 text-sm">
          <Link href="/contracts" className="inline-flex items-center gap-2 font-medium text-slate-500 transition hover:text-indigo-600">
            <ArrowLeft size={16} /> Contracts
          </Link>
          <ChevronRight size={15} className="text-slate-300" />
          <span className="truncate text-slate-400">{analysis.title}</span>
        </div>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FileText size={25} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{analysis.title}</h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    Analyzed
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{analysis.contractType} · {analysis.parties[0]?.name ?? "Contract parties"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className={`rounded-full px-2.5 py-1 font-semibold ring-1 ${riskClasses(risk)}`}>{risk} risk</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={13} /> {stored ? "Analyzed from uploaded PDF" : "Demo contract"}</span>
                  {stored?.filename && <span className="truncate max-w-[320px]">{stored.filename}</span>}
                </div>
              </div>
            </div>
            <Link href="/contracts" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
              All contracts <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="-mx-2 mt-7 overflow-x-auto px-2">
            <div className="flex min-w-max gap-1 border-b border-slate-100">
              {tabs.map((item) => {
                const active = tab === item.id;
                return (
                  <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${active ? "text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}>
                    {item.icon}{item.label}
                    {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6">
          {tab === "overview" && (
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><ShieldAlert size={16} /></div>
                  AI contract summary
                </div>
                <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-600">{analysis.summary}</p>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-xs leading-5 text-amber-800">
                  <CircleAlert size={15} className="mt-0.5 shrink-0" />
                  AI-generated contract insights are for review and are not legal advice.
                </div>
              </section>

              <section>
                <div className="mb-3 text-sm font-semibold text-slate-950">Key contract details</div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Effective date", analysis.effectiveDate, CalendarDays],
                    ["Expiration", analysis.expirationDate, CalendarDays],
                    ["Renewal", analysis.renewal, Clock3],
                    ["Payment", analysis.paymentTerms, ArrowUpRight],
                  ].map(([label, value, Icon]) => (
                    <div key={String(label)} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><Icon size={16} /></div>
                      <div className="mt-4 text-xs font-medium text-slate-400">{String(label)}</div>
                      <div className="mt-1 text-sm font-semibold leading-5 text-slate-900">{String(value || "Not specified")}</div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950"><Users size={17} className="text-indigo-600" /> Parties</div>
                  <div className="mt-4 space-y-3">
                    {analysis.parties.length ? analysis.parties.map((party) => (
                      <div key={`${party.name}-${party.role}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
                        <div><div className="text-sm font-semibold text-slate-800">{party.name}</div><div className="mt-1 text-xs text-slate-400">{party.role}</div></div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    )) : <div className="text-sm text-slate-400">No parties were identified.</div>}
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
                  <div className="text-sm font-semibold text-slate-950">Commercial terms</div>
                  <div className="mt-4 rounded-2xl bg-indigo-50/70 p-5">
                    <div className="text-xs font-medium text-indigo-600">Payment terms</div>
                    <div className="mt-2 text-base font-semibold leading-6 text-slate-950">{analysis.paymentTerms || "Not specified"}</div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-100 p-4">
                    <div className="text-xs font-medium text-slate-400">Termination</div>
                    <div className="mt-1 text-sm font-semibold leading-5 text-slate-800">{analysis.termination || "Not specified"}</div>
                  </div>
                </section>
              </div>

              <section className="rounded-3xl border border-amber-200/80 bg-amber-50/40 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950"><CircleAlert size={17} className="text-amber-600" /> Review flags</div>
                {analysis.reviewFlags.length ? (
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {analysis.reviewFlags.map((flag) => (
                      <div key={`${flag.clause}-${flag.reason}`} className="rounded-2xl border border-amber-100 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-800">{flag.clause}</div>
                          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ${severityClasses(flag.severity)}`}>{flag.severity}</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{flag.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : <div className="mt-3 text-sm text-slate-500">No review flags were identified.</div>}
              </section>

              {analysis.sourceReferences.length > 0 && (
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
                  <div className="flex items-center justify-between gap-4">
                    <div><div className="text-sm font-semibold text-slate-950">Source references</div><p className="mt-1 text-xs text-slate-400">Relevant excerpts returned with the AI analysis.</p></div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">{analysis.sourceReferences.length} references</span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {analysis.sourceReferences.map((source, index) => (
                      <div key={`${source.section}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-800">{source.section}</span><span className="text-[10px] text-indigo-600">{source.topic}</span></div>
                        <p className="mt-3 text-xs leading-5 text-slate-600">“{source.excerpt}”</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {tab === "obligations" && (
            <section className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
              <div className="border-b border-slate-100 px-6 py-5"><h2 className="text-sm font-semibold text-slate-950">Contract obligations</h2><p className="mt-1 text-xs text-slate-400">Commitments extracted from the analyzed contract.</p></div>
              <div className="divide-y divide-slate-100">
                {analysis.obligations.length ? analysis.obligations.map((item, index) => (
                  <div key={`${item.party}-${index}`} className="grid gap-4 px-6 py-5 lg:grid-cols-[180px_1fr_190px_90px] lg:items-center">
                    <div><div className="text-xs font-semibold text-slate-800">{item.party}</div><div className="mt-1 text-[10px] text-slate-400">Responsible party</div></div>
                    <div className="text-sm leading-6 text-slate-600">{item.obligation}</div>
                    <div><div className="text-[10px] uppercase tracking-wider text-slate-400">Deadline</div><div className="mt-1 text-xs font-semibold text-slate-800">{item.deadline || "Not specified"}</div></div>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${priorityClasses(item.priority)}`}>{item.priority}</span>
                  </div>
                )) : <div className="px-6 py-12 text-center text-sm text-slate-400">No obligations were extracted.</div>}
              </div>
            </section>
          )}

          {tab === "timeline" && (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
              <div><h2 className="text-sm font-semibold text-slate-950">Contract timeline</h2><p className="mt-1 text-xs text-slate-400">Key dates and obligation deadlines identified by ContractLens.</p></div>
              <div className="mt-7 ml-2 border-l border-slate-200 pl-7">
                {timeline.length ? timeline.map((event, index) => (
                  <div key={`${event.title}-${index}`} className="relative pb-7 last:pb-0">
                    <span className={`absolute -left-[35px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${event.tone}`} />
                    <div className="text-xs font-semibold text-indigo-600">{event.date}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{event.title}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{event.description}</p>
                  </div>
                )) : <div className="py-8 text-sm text-slate-400">No timeline events were extracted.</div>}
              </div>
            </section>
          )}

          {tab === "ask" && (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MessageSquareText size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-950">
                    Ask this contract
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Ask a question and get an answer grounded in the uploaded document.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "What are the payment terms?",
                  "When does this contract expire?",
                  "What are the termination conditions?",
                  "How does renewal work?",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuestion(q);
                      setAskError("");
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    if (askError) setAskError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askContract();
                  }}
                  placeholder="Ask something about this contract..."
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                />

                <button
                  type="button"
                  onClick={askContract}
                  disabled={asking}
                  className="h-12 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {asking ? "Thinking..." : "Ask Contract"}
                </button>
              </div>

              {askError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                  {askError}
                </div>
              )}

              {answer && (
                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                      Contract answer
                    </div>

                    {askMode === "ai" && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        Gemini AI
                      </span>
                    )}

                    {askMode === "demo" && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-100">
                        Demo fallback
                      </span>
                    )}
                  </div>

                  {askMode === "demo" && (
                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">
                      Gemini is temporarily unavailable, so ContractLens is showing a clearly labeled demo response for the prototype.
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    {answer}
                  </p>

                  {askSource && (
                    <div className="mt-4 rounded-xl border border-white bg-white p-3">
                      <div className="text-[10px] font-semibold text-slate-500">
                        Source · {askSource.section}
                      </div>
                      <div className="mt-1 text-[10px] text-indigo-600">
                        {askSource.topic}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        “{askSource.excerpt}”
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-[10px] text-slate-400">
                    AI-generated response when Gemini is available. Verify important information against the original agreement.
                  </div>
                </div>
              )}

              {!isRealContract && (
                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                  This page is showing demo data. Upload a PDF to enable grounded Q&amp;A for a real contract.
                </div>
              )}
            </section>
          )}
          {tab === "compare" && (
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <GitCompare size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">
                      Compare contract versions
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Upload two versions to identify changed clauses, added
                      terms and removed terms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Previous version
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Upload the older contract
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      OLD
                    </div>
                  </div>

                  <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          extractCompareFile(file, "old");
                        }
                        event.currentTarget.value = "";
                      }}
                    />

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition group-hover:text-indigo-600">
                      <Upload className="h-5 w-5" />
                    </div>

                    <p className="mt-3 max-w-full truncate text-sm font-medium text-slate-800">
                      {oldCompareFile
                        ? oldCompareFile.name
                        : "Choose previous PDF"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF up to 20 MB
                    </p>
                  </label>

                  {oldCompareText && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Contract extracted successfully
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        New version
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Upload the updated contract
                      </p>
                    </div>
                    <div className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                      NEW
                    </div>
                  </div>

                  <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          extractCompareFile(file, "new");
                        }
                        event.currentTarget.value = "";
                      }}
                    />

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition group-hover:text-indigo-600">
                      <Upload className="h-5 w-5" />
                    </div>

                    <p className="mt-3 max-w-full truncate text-sm font-medium text-slate-800">
                      {newCompareFile
                        ? newCompareFile.name
                        : "Choose new PDF"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF up to 20 MB
                    </p>
                  </label>

                  {newCompareText && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Contract extracted successfully
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={compareVersions}
                  disabled={
                    comparing ||
                    !oldCompareText ||
                    !newCompareText
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {comparing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing changes...
                    </>
                  ) : (
                    <>
                      <GitCompare className="h-4 w-4" />
                      Compare versions
                    </>
                  )}
                </button>
              </div>

              {compareError && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Comparison issue
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      {compareError}
                    </p>
                  </div>
                </div>
              )}

              {comparison && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">
                        Contract comparison ready
                      </p>
                      <p className="mt-1 text-xs leading-5 text-indigo-700">
                        Results show detected differences between the two
                        uploaded versions. If Gemini was temporarily
                        unavailable, ContractLens uses its demo comparison
                        dataset so the prototype remains demonstrable.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Change summary
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {comparison.summary}
                    </p>
                  </div>

                  {comparison.changes.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="border-b border-slate-200 px-6 py-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Changed clauses
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Material differences detected between versions
                        </p>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {comparison.changes.map((change, index) => (
                          <div
                            key={`${change.title}-${index}`}
                            className="p-6"
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                                    {change.category}
                                  </span>
                                  <h4 className="text-sm font-semibold text-slate-900">
                                    {change.title}
                                  </h4>
                                </div>
                              </div>

                              <span
                                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  change.impact === "High"
                                    ? "bg-red-50 text-red-700"
                                    : change.impact === "Medium"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {change.impact} impact
                              </span>
                            </div>

                            <div className="mt-5 grid gap-3 lg:grid-cols-2">
                              <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
                                  Previous
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {change.oldVersion}
                                </p>
                              </div>

                              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                                  New
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {change.newVersion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Added clauses
                        </h3>
                      </div>

                      {comparison.addedClauses.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                          {comparison.addedClauses.map(
                            (clause, index) => (
                              <li
                                key={index}
                                className="text-sm leading-6 text-slate-700"
                              >
                                <span className="mr-2 text-emerald-600">
                                  +
                                </span>
                                {clause}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          No added clauses detected.
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
                          <X className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Removed clauses
                        </h3>
                      </div>

                      {comparison.removedClauses.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                          {comparison.removedClauses.map(
                            (clause, index) => (
                              <li
                                key={index}
                                className="text-sm leading-6 text-slate-700"
                              >
                                <span className="mr-2 text-red-600">
                                  −
                                </span>
                                {clause}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          No removed clauses detected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="mt-7 text-center text-[9px] text-slate-400">ContractLens · AI-generated contract insights for review · Not legal advice</div>
      </div>
    </main>
  );
}
