"use client";

import {
  BellAlertIcon,
  CheckIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  LinkIcon,
  LockClosedIcon,
  PencilIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, type ComponentType } from "react";
import Button from "@/components/atoms/Button/Button";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { Switch } from "@/components/ui/switch";

const preferenceCopy = [
  ["Shop updates", "Approvals, declines, and access unlocks"],
  ["Messages", "A creator or brand writes in your thread"],
  ["Deadline nudges", "Three days, one day, and on the delivery day"],
  ["Ratings & receipts", "Completed-shop records and rating prompts"],
] as const;

type Section = "profile" | "notifications" | "account";

function SettingsNav({ active, onChange }: { active: Section; onChange: (section: Section) => void }) {
  const links: [Section, string, ComponentType<{ className?: string }>][] = [
    ["profile", "Profile", UserCircleIcon],
    ["notifications", "Notifications", BellAlertIcon],
    ["account", "Account & security", ShieldCheckIcon],
  ];

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <p className="mb-3 hidden px-3 text-[11px] font-semibold text-neutral-400 lg:block">Account settings</p>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {links.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`group relative flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.96] lg:w-full ${active === id ? "bg-neutral-100 text-neutral-950" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"}`}
          >
            <Icon className="size-[18px]" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function SectionTitle({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <header><p className="text-[10px] font-bold tracking-[0.18em] text-neutral-400 uppercase">{kicker}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-neutral-950">{title}</h2><p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-500">{description}</p></header>;
}

function SettingRow({ icon: Icon, label, value, onClick, last = false }: { icon: ComponentType<{ className?: string }>; label: string; value?: string; onClick?: () => void; last?: boolean }) {
  const row = <><span className={`grid size-9 shrink-0 place-items-center rounded-xl text-neutral-600 ${onClick ? "bg-neutral-100 group-hover:bg-neutral-200" : "bg-neutral-50"}`}><Icon className="size-[18px]" /></span>
    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-neutral-900">{label}</span></span>
    {value ? <span className="max-w-44 truncate text-sm text-neutral-400">{value}</span> : null}
    {onClick ? <ChevronRightIcon className="size-4 shrink-0 text-neutral-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-neutral-600" /> : null}</>;

  return onClick
    ? <button onClick={onClick} className={`group flex min-h-16 w-full items-center gap-3 px-4 text-left transition-[background-color,transform] duration-150 hover:bg-neutral-50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 active:scale-[0.99] ${last ? "" : "border-b border-neutral-100"}`}>{row}</button>
    : <div className={`flex min-h-16 w-full items-center gap-3 px-4 ${last ? "" : "border-b border-neutral-100"}`}>{row}</div>;
}

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState([true, true, true, false]);
  const [emailMode, setEmailMode] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [passkeyAdded, setPasskeyAdded] = useState(false);

  function saveProfile() { setSaved(true); window.setTimeout(() => setSaved(false), 2400); }

  return <CreatorShell><div className="min-h-[calc(100vh-5rem)] bg-white px-5 py-8 sm:px-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Settings</h1>
        <p className="mt-2 text-sm text-neutral-500">Manage your profile, preferences, and account security.</p>
      </header>

      <div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <SettingsNav active={section} onChange={setSection} />
        <main className="min-w-0">
          {section === "profile" ? <div className="space-y-5">
            <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 p-5 sm:p-7"><SectionTitle kicker="Public profile" title="The face of your creator shop" description="Brands see these details when reviewing your work and deciding who to bring into a campaign." /></div>
              <div className="p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="grid size-16 place-items-center rounded-[1.35rem] bg-[#c8ff7a] text-lg font-bold tracking-tight">JL</span><div><p className="text-sm font-semibold">Profile image</p><p className="mt-1 text-xs text-neutral-500">A clear image helps brands recognise you.</p></div></div><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-xs font-semibold transition-[background-color,transform] hover:bg-neutral-50 active:scale-[0.96]"><PencilIcon className="size-3.5" /> Change image</button></div>
                <div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-neutral-600">Display name<input defaultValue="Jordan Lee" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></label><label className="text-xs font-semibold text-neutral-600">Niche<input defaultValue="Design & creative tools" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></label><label className="text-xs font-semibold text-neutral-600 sm:col-span-2">Bio<textarea defaultValue="Designing a calmer, more capable internet — one tool at a time." rows={3} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium leading-6 text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></label></div>
                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5"><p className="hidden text-xs text-neutral-400 sm:block">Changes appear on your creator profile.</p><Button onClick={saveProfile} size="sm" className="ml-auto">{saved ? <><CheckIcon className="size-4" /> Saved</> : "Save changes"}</Button></div>
              </div>
            </section>
            <section className="rounded-[20px] border border-neutral-200 bg-white p-5 sm:p-6"><p className="text-sm font-semibold">Profile visibility</p><p className="mt-1 text-sm leading-6 text-neutral-500">Your profile is currently visible to brands. You can pause applications from your shop dashboard at any time.</p></section>
          </div> : null}

          {section === "notifications" ? <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white"><div className="p-5 sm:p-7"><SectionTitle kicker="Notifications" title="Stay in the loop, selectively" description="Switch on the updates that keep projects moving and leave the rest behind." /></div><div className="border-t border-neutral-100 px-5 sm:px-7">{preferenceCopy.map(([label, description], index) => <div key={label} className="flex min-h-[5.5rem] items-center justify-between gap-5 border-b border-neutral-100 py-4 last:border-0"><div id={`preference-${index}`}><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-neutral-500">{description}</p></div><Switch checked={preferences[index]} onCheckedChange={(checked) => setPreferences(current => current.map((value, i) => i === index ? checked : value))} aria-labelledby={`preference-${index}`} /></div>)}</div></section> : null}

          {section === "account" ? <div className="space-y-5"><section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white"><div className="p-5 sm:p-7"><SectionTitle kicker="Sign in" title="Account & security" description="Keep your account secure and make it easy to access from the devices you trust." /></div><div className="border-t border-neutral-100"><SettingRow icon={EnvelopeIcon} label="Email address" value="jordan@jordanlee.co" onClick={() => { setEmailMode(true); setEmailRequested(false); }} /><SettingRow icon={KeyIcon} label="Password" value="Changed 4 months ago" /><SettingRow icon={LockClosedIcon} label="Passkey" value={passkeyAdded ? "1 passkey" : "Add a passkey"} last onClick={() => setPasskeyAdded(true)} /></div></section>
            <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white"><div className="flex items-start justify-between gap-4 p-5 sm:p-7"><SectionTitle kicker="Connected access" title="Apps and sessions" description="Review the services and devices that can access your account." /><span className="mt-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-neutral-500 uppercase">All clear</span></div><div className="border-t border-neutral-100"><SettingRow icon={LinkIcon} label="Connected apps" value="None" /><SettingRow icon={ShieldCheckIcon} label="Login activity" value="This device" last /></div></section>
            <section className="rounded-[20px] border border-red-100 bg-white p-5 sm:p-7"><SectionTitle kicker="Permanent action" title="Delete your account" description="Remove your Creatorshop profile and account. Completed-shop receipts remain available to the other party for record-keeping." /><button onClick={() => setDeleteMode(true)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-red-600 underline decoration-red-200 underline-offset-4 transition-colors hover:text-red-700"><TrashIcon className="size-4" /> Delete account</button></section>
          </div> : null}
        </main>
      </div>
    </div>
  </div>
  {emailMode ? <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4"><div role="dialog" aria-modal="true" aria-labelledby="change-email-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl"><h2 id="change-email-title" className="text-xl font-bold tracking-tight">Change email address</h2>{emailRequested ? <div className="mt-5 rounded-2xl bg-[#eef4e4] p-4"><div className="flex items-center gap-2 text-sm font-bold"><CheckIcon className="size-4" /> Check your inbox</div><p className="mt-1 text-sm leading-6 text-neutral-600">We sent a verification link to your new address. Your sign-in email will not change until you confirm it.</p></div> : <><p className="mt-2 text-sm leading-6 text-neutral-500">For your security, we’ll verify the new email before changing your sign-in.</p><label className="mt-5 block text-xs font-semibold text-neutral-600">New email address<input type="email" placeholder="you@example.com" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label><label className="mt-4 block text-xs font-semibold text-neutral-600">Current password<input type="password" placeholder="••••••••" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label></>}<div className="mt-6 flex justify-end gap-2"><Button variant="secondary" size="sm" onClick={() => setEmailMode(false)}>Cancel</Button>{!emailRequested ? <Button size="sm" onClick={() => setEmailRequested(true)}>Send verification</Button> : null}</div></div></div> : null}
  {deleteMode ? <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4"><div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl"><span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600"><ExclamationTriangleIcon className="size-6" /></span><h2 id="delete-account-title" className="mt-5 text-xl font-bold tracking-tight">Delete your account?</h2><p className="mt-2 text-sm leading-6 text-neutral-500">This cannot be undone. You will lose access to your profile, saved products, messages, and shops. Type <strong className="font-semibold text-neutral-900">DELETE</strong> to continue.</p><input value={deleteText} onChange={event => setDeleteText(event.target.value)} placeholder="DELETE" className="mt-5 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-red-500" /><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" size="sm" onClick={() => { setDeleteMode(false); setDeleteText(""); }}>Keep account</Button><Button variant="danger" size="sm" disabled={deleteText !== "DELETE"}>Delete account</Button></div></div></div> : null}
  </CreatorShell>;
}
