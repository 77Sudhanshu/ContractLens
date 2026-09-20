"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Clock3,
  GitCompare,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <FileSearch size={21} />
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight">
              ContractLens
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Contract Intelligence
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>

          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>

          <a href="#ai" className="transition hover:text-white">
            AI Agent
          </a>
        </div>

        <Link
          href="/contracts"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          Open Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={15} />
            AI-powered contract intelligence
          </div>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Turn complex contracts into
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              actionable intelligence.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            ContractLens uses an AI agent to understand contracts, extract
            obligations, track important dates, compare versions, and answer
            questions with source-backed evidence.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contracts"
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Explore ContractLens
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              See how it works
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Product Preview */}
        <div className="relative mx-auto mt-20 max-w-6xl">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1118] shadow-2xl">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

              <div className="ml-4 flex-1 rounded-md border border-white/5 bg-white/[0.03] px-4 py-1.5 text-xs text-zinc-600">
                app.contractlens.ai/dashboard
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="grid min-h-[390px] grid-cols-12">
              {/* Sidebar */}
              <div className="col-span-3 hidden border-r border-white/10 p-5 md:block">
                <div className="mb-8 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600" />
                  <div className="h-3 w-24 rounded bg-white/10" />
                </div>

                <div className="space-y-2">
                  {[
                    "Dashboard",
                    "Contracts",
                    "Obligations",
                    "Timeline",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2.5 text-xs ${
                        index === 0
                          ? "bg-blue-500/10 text-blue-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main */}
              <div className="col-span-12 p-6 md:col-span-9 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-medium">
                      Contract Overview
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      AI-powered contract workspace
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium">
                    + Upload Contract
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    ["12", "Contracts"],
                    ["27", "Obligations"],
                    ["04", "Attention"],
                    ["08", "Active"],
                  ].map(([number, label]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="text-xl font-semibold">{number}</div>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-medium">
                        Upcoming obligations
                      </span>

                      <Clock3 size={14} className="text-zinc-500" />
                    </div>

                    <div className="space-y-3">
                      {[
                        ["Renewal notice", "12 days", "high"],
                        ["Compliance review", "28 days", "medium"],
                        ["Annual payment", "45 days", "low"],
                      ].map(([name, days, priority]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
                        >
                          <div>
                            <div className="text-xs">{name}</div>
                            <div className="mt-1 text-[10px] text-zinc-600">
                              Contract obligation
                            </div>
                          </div>

                          <span
                            className={`text-[10px] ${
                              priority === "high"
                                ? "text-red-400"
                                : priority === "medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {days}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Brain size={15} className="text-blue-400" />
                      <span className="text-xs font-medium">
                        Agent activity
                      </span>
                    </div>

                    <div className="space-y-4">
                      {[
                        "Contract analyzed",
                        "12 obligations extracted",
                        "Sources verified",
                        "Timeline generated",
                      ].map((activity) => (
                        <div
                          key={activity}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-[9px] text-green-400">
                            ✓
                          </div>
                          <span className="text-xs text-zinc-400">
                            {activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-blue-400">
              BUILT FOR CONTRACT OPERATIONS
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              From documents to decisions.
            </h2>

            <p className="mt-4 leading-7 text-zinc-500">
              ContractLens doesn't stop at summarizing documents. Its agent
              analyzes, verifies, extracts and organizes the information your
              team actually needs.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Feature
              icon={<FileSearch size={20} />}
              title="Contract Intelligence"
              description="Extract parties, dates, payment terms, termination clauses and other critical information."
            />

            <Feature
              icon={<ShieldCheck size={20} />}
              title="Source-Backed Answers"
              description="Every important answer can be traced back to the relevant contract section and page."
            />

            <Feature
              icon={<GitCompare size={20} />}
              title="Version Comparison"
              description="Compare contract versions and quickly understand meaningful changes."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <div className="text-sm font-medium text-blue-400">
            HOW IT WORKS
          </div>

          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            One agent. Multiple contract tasks.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {[
            ["01", "Upload", "Upload your contract document."],
            ["02", "Understand", "The AI agent analyzes the document."],
            ["03", "Reason", "Agents extract obligations and important clauses."],
            ["04", "Act", "Get answers, timelines and verified insights."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="text-xs text-blue-400">{number}</div>
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI section */}
      <section id="ai" className="mx-auto max-w-7xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 p-8 md:p-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
              <Brain size={17} />
              Agentic AI
            </div>

            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              More than a chatbot.
            </h2>

            <p className="mt-5 leading-7 text-zinc-400">
              ContractLens coordinates specialized AI agents that analyze
              documents, search relevant clauses, extract obligations,
              compare versions and verify important answers against their
              original sources.
            </p>

            <Link
              href="/contracts"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Start exploring
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-zinc-600 md:flex-row">
          <div>© 2026 ContractLens</div>
          <div>AI-powered contract intelligence</div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.04]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-medium">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}