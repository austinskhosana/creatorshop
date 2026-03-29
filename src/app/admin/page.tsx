"use client";

import { useState } from "react";

type Plan = "FREE" | "STARTER" | "PRO";

const PLANS: {
  id: Plan;
  name: string;
  price: number;
  billing: string;
  features: string[];
}[] = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    billing: "Forever free",
    features: ["1 active listing", "Up to 5 keys per listing", "Basic analytics"],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: 29,
    billing: "per month",
    features: ["5 active listings", "Up to 50 keys per listing", "Full analytics", "Priority support"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 79,
    billing: "per month",
    features: ["Unlimited listings", "Unlimited keys", "Advanced analytics", "Priority support", "Custom branding"],
  },
];

const MOCK_INVOICES = [
  { id: "INV-004", date: "1 Mar 2026",  amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "1 Feb 2026",  amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "1 Jan 2026",  amount: "$29.00", status: "Paid" },
  { id: "INV-001", date: "1 Dec 2025",  amount: "$29.00", status: "Paid" },
];

function SectionCard({ title, description, icon, children }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-4 px-6 pt-6 pb-6 bg-gradient-to-b from-[#A3FF38]/40 to-white">
        <div className="w-11 h-11 rounded-2xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center flex-shrink-0 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          {icon}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-neutral-900">{title}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}

export default function AdminPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("STARTER");
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const activePlan = PLANS.find((p) => p.id === currentPlan)!;
  const nextBillingDate = "1 Apr 2026";

  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-neutral-900">Subscription</h1>
          <p className="text-[15px] text-gray-400">Manage your Creatorshop plan and billing.</p>
        </div>

        {/* ── Current plan ── */}
        <SectionCard
          title="Current plan"
          description="Your active subscription and next billing date."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z" clipRule="evenodd" />
            </svg>
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-[22px] font-bold text-neutral-900">{activePlan.name}</p>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A3FF38]/20 text-green-800">Active</span>
              </div>
              <p className="text-[14px] text-gray-400">
                {activePlan.price === 0
                  ? "Free forever"
                  : `$${activePlan.price}/mo · Next billing ${nextBillingDate}`}
              </p>
            </div>
            {currentPlan !== "FREE" && (
              <button
                onClick={() => setConfirmingCancel(true)}
                className="px-4 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors duration-[120ms]"
              >
                Cancel plan
              </button>
            )}
          </div>

          {/* Cancel confirmation */}
          {confirmingCancel && (
            <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between gap-4">
              <p className="text-[13px] text-red-600">
                Your plan will be cancelled at the end of the current billing period. You'll move to Free.
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setCurrentPlan("FREE"); setConfirmingCancel(false); }}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmingCancel(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[12px] font-medium text-gray-600 hover:bg-white transition-colors duration-[120ms]"
                >
                  Keep plan
                </button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Plan comparison ── */}
        <SectionCard
          title="Plans"
          description="Upgrade or downgrade at any time."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
          }
        >
          <div className="flex flex-col gap-3">
            {PLANS.map((plan) => {
              const isActive = plan.id === currentPlan;
              return (
                <div
                  key={plan.id}
                  className={[
                    "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors duration-[120ms]",
                    isActive
                      ? "border-[#82F200] bg-[#A3FF38]/10"
                      : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold text-neutral-900">{plan.name}</p>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#A3FF38] text-gray-900">Current</span>
                      )}
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-0.5">
                      {plan.features.map((f) => (
                        <li key={f} className="text-[12px] text-gray-500">{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[18px] font-bold text-neutral-900">
                        {plan.price === 0 ? "Free" : `$${plan.price}`}
                      </p>
                      {plan.price > 0 && (
                        <p className="text-[11px] text-gray-400">{plan.billing}</p>
                      )}
                    </div>
                    {!isActive && (
                      <button
                        onClick={() => { setCurrentPlan(plan.id); setConfirmingCancel(false); }}
                        className={[
                          "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-[140ms] active:scale-[0.98]",
                          plan.price > activePlan.price
                            ? "bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 hover:brightness-95"
                            : "border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-gray-600 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        {plan.price > activePlan.price ? "Upgrade" : "Downgrade"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Payment method ── */}
        <SectionCard
          title="Payment method"
          description="Your card on file for billing."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
            </svg>
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-gray-100 flex items-center justify-center">
                <svg viewBox="0 0 38 24" className="w-7 h-5" fill="none">
                  <rect width="38" height="24" rx="4" fill="#E8E8E8"/>
                  <circle cx="15" cy="12" r="7" fill="#EB001B" fillOpacity="0.9"/>
                  <circle cx="23" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9"/>
                  <path d="M19 7.1a7 7 0 0 1 0 9.8A7 7 0 0 1 19 7.1Z" fill="#FF5F00"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-medium text-neutral-900">Mastercard ending in 4242</p>
                <p className="text-[12px] text-gray-400">Expires 09 / 27</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms]">
              Update
            </button>
          </div>
        </SectionCard>

        {/* ── Billing history ── */}
        <SectionCard
          title="Billing history"
          description="Your past invoices."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
          }
        >
          <div className="flex flex-col divide-y divide-gray-100">
            {MOCK_INVOICES.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <p className="text-[13px] font-medium text-neutral-900">{inv.date}</p>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#A3FF38]/20 text-green-800">{inv.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[13px] font-medium text-neutral-900">{inv.amount}</p>
                  <button className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms]">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
