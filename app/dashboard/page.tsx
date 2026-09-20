"use client";

import Link from "next/link";
import {
  Bell,
  Brain,
  CalendarClock,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  GitCompare,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const contracts = [
  {
    name: "Acme Software Services Agreement",
    company: "Acme Technologies",
    status: "Active",
    updated: "2 hours ago",
    obligations: 8,
    color: "blue",
  },
  {
    name: "Cloud Infrastructure Agreement",
    company: "Nimbus Cloud",
    status: "Active",
    updated: "Yesterday",
    obligations: 12,
    color: "violet",
  },
  {
    name: "Marketing Partnership Agreement",
    company: "GrowthLabs",
    status: "Review",
    updated: "3 days ago",
    obligations: 5,
    color: "yellow",
  },
];

const obligations = [
  {
    title: "Renewal notice deadline",
    contract: "Acme Software Services Agreement",
    date: "Oct 01, 2026",
    days: "12 days",
    priority: "High",
  },
  {
    title: "Annual compliance review",
    contract: "Cloud Infrastructure Agreement",
    date: "Oct 17, 2026",
    days: "28 days",
    priority: "Medium",
  },
  {
    title: "Quarterly payment obligation",
    contract: "Marketing Partnership Agreement",
    date: "Nov 03, 2026",
    days: "45 days",
    priority: "Low",
  },
];

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0a0d12] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <FileText size={18} />
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                ContractLens
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Contract Intelligence
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Workspace
          </div>

          <nav className="space-y-1">
            <NavItem
              icon={<LayoutDashboard size={17} />}
              label="Dashboard"
              active
            />

            <Link href="/contracts">
              <NavItem
                icon={<FileText size={17} />}
                label="Contracts"
              />
            </Link>

            <NavItem
              icon={<CalendarClock size={17} />}
              label="Obligations"
            />

            <NavItem
              icon={<Clock3 size={17} />}
              label="Timeline"
            />
          </nav>

          <div className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Intelligence
          </div>

          <nav className="space-y-1">
            <NavItem
              icon={<Brain size={17} />}
              label="AI Assistant"
            />

            <NavItem
              icon={<GitCompare size={17} />}
              label="Compare Versions"
            />

            <NavItem
              icon={<ShieldCheck size={17} />}
              label="Source Verification"
            />
          </nav>

          <div className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            System
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Users size={17} />} label="Team" />
            <NavItem icon={<Settings size={17} />} label="Settings" />
          </nav>
        </div>

        {/* AI Agent card */}
        <div className="m-4 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Sparkles size={15} className="text-blue-400" />
            </div>

            <span className="text-xs font-medium">Contract Agent</span>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-zinc-500">
            AI agent is ready to analyze your contracts.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Agent online
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#07090d]/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="text-sm text-zinc-500">Workspace</div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-500 md:flex">
              <Search size={14} />
              Search
              <span className="ml-5 rounded border border-white/10 px-1.5 py-0.5 text-[9px]">
                /
              </span>
            </button>

            <button className="relative rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
            </button>

            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold sm:flex">
              SB
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 md:py-9">
          {/* Welcome */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Saturday, September 19, 2026</span>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Good evening, Sudhanshu.
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Here's what needs your attention today.
              </p>
            </div>

            <Link
              href="/contracts"
              className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              <Plus size={17} />
              Add Contract
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<FileText size={18} />}
              number="12"
              label="Total Contracts"
              change="+2 this month"
            />

            <StatCard
              icon={<FileCheck2 size={18} />}
              number="27"
              label="Active Obligations"
              change="4 due soon"
            />

            <StatCard
              icon={<Clock3 size={18} />}
              number="04"
              label="Needs Attention"
              change="2 high priority"
              warning
            />

            <StatCard
              icon={<ShieldCheck size={18} />}
              number="96%"
              label="Verified Insights"
              change="+4.2% this month"
            />
          </div>

          {/* Main grid */}
          <div className="mt-7 grid gap-5 xl:grid-cols-3">
            {/* Contracts */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] xl:col-span-2">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <div>
                  <h3 className="text-sm font-semibold">
                    Recent Contracts
                  </h3>

                  <p className="mt-1 text-xs text-zinc-600">
                    Recently analyzed documents
                  </p>
                </div>

                <Link
                  href="/contracts"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-white/5">
                {contracts.map((contract) => (
                  <div
                    key={contract.name}
                    className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          contract.color === "blue"
                            ? "bg-blue-500/10 text-blue-400"
                            : contract.color === "violet"
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        <FileText size={18} />
                      </div>

                      <div>
                        <div className="text-sm font-medium transition group-hover:text-blue-300">
                          {contract.name}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                          <span>{contract.company}</span>
                          <span>•</span>
                          <span>{contract.updated}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">
                          {contract.obligations}
                        </div>
                        <div className="mt-1 text-[10px] text-zinc-600">
                          obligations
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] ${
                          contract.status === "Active"
                            ? "border-green-500/20 bg-green-500/10 text-green-400"
                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent activity */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-blue-400" />
                  <h3 className="text-sm font-semibold">
                    Agent Activity
                  </h3>
                </div>

                <p className="mt-1 text-xs text-zinc-600">
                  Latest ContractLens actions
                </p>
              </div>

              <div className="space-y-5 p-5">
                <AgentActivity
                  title="Contract analyzed"
                  description="Acme Software Services Agreement"
                  time="2 hours ago"
                />

                <AgentActivity
                  title="8 obligations extracted"
                  description="3 deadlines identified"
                  time="2 hours ago"
                />

                <AgentActivity
                  title="Sources verified"
                  description="12 AI insights verified"
                  time="2 hours ago"
                />

                <AgentActivity
                  title="Timeline generated"
                  description="Upcoming dates added"
                  time="2 hours ago"
                />

                <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-300">
                    <Sparkles size={14} />
                    Agent status
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Ready for your next contract
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Obligations */}
          <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold">
                  Upcoming Obligations
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Deadlines and contractual commitments requiring attention
                </p>
              </div>

              <button className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300">
                View timeline
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {obligations.map((obligation) => (
                <div
                  key={obligation.title}
                  className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        obligation.priority === "High"
                          ? "bg-red-400"
                          : obligation.priority === "Medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                      }`}
                    />

                    <div>
                      <div className="text-sm font-medium">
                        {obligation.title}
                      </div>

                      <div className="mt-1 text-xs text-zinc-600">
                        {obligation.contract}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:pr-2">
                    <div className="text-right">
                      <div className="text-xs text-zinc-400">
                        {obligation.date}
                      </div>

                      <div className="mt-1 text-[10px] text-zinc-600">
                        Due date
                      </div>
                    </div>

                    <div className="min-w-[60px] text-right">
                      <div
                        className={`text-xs font-medium ${
                          obligation.priority === "High"
                            ? "text-red-400"
                            : obligation.priority === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {obligation.days}
                      </div>

                      <div className="mt-1 text-[10px] text-zinc-600">
                        remaining
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upload CTA */}
          <section className="relative mt-5 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/[0.08] via-transparent to-violet-500/[0.08] p-6 md:p-8">
            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                  <Upload size={16} />
                  Analyze a new contract
                </div>

                <h3 className="mt-2 text-xl font-semibold">
                  Let the ContractLens agent do the heavy lifting.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Upload a contract and automatically extract key terms,
                  obligations, deadlines and source-backed insights.
                </p>
              </div>

              <Link
                href="/contracts"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                <Upload size={16} />
                Upload Contract
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-blue-500/10 text-blue-300"
          : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({
  icon,
  number,
  label,
  change,
  warning = false,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
  change: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <span
          className={`text-[10px] ${
            warning ? "text-yellow-400" : "text-zinc-600"
          }`}
        >
          {change}
        </span>
      </div>

      <div className="mt-5 text-2xl font-semibold tracking-tight">
        {number}
      </div>

      <div className="mt-1 text-xs text-zinc-600">{label}</div>
    </div>
  );
}

function AgentActivity({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-[10px] text-green-400">
        ✓
      </div>

      <div className="min-w-0">
        <div className="text-xs font-medium">{title}</div>
        <div className="mt-1 truncate text-[10px] text-zinc-600">
          {description}
        </div>
        <div className="mt-1 text-[9px] text-zinc-700">{time}</div>
      </div>
    </div>
  );
}