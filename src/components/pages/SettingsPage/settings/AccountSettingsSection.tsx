"use client";

import {
  CheckIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  LinkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { ModalSecondaryAction, SectionTitle, SettingRow } from "./SettingsPrimitives";

export function AccountSettingsSection() {
  const [emailMode, setEmailMode] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [passkeyAdded, setPasskeyAdded] = useState(false);

  function closePasswordModal() {
    setPasswordMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const passwordIsValid = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <>
      <div className="space-y-5">
        <section className="rounded-[20px] bg-white p-5 sm:p-7">
          <SectionTitle title="Account & security" description="Keep your account secure and make it easy to access from the devices you trust." />
          <div className="mt-6 space-y-3">
            <SettingRow icon={EnvelopeIcon} label="Email address" value="jordan@jordanlee.co" actionLabel="Change" onClick={() => { setEmailMode(true); setEmailRequested(false); }} />
            <SettingRow icon={KeyIcon} label="Password" value={passwordChanged ? "Changed just now" : "Changed 4 months ago"} actionLabel="Change" onClick={() => setPasswordMode(true)} />
            <SettingRow icon={LockClosedIcon} label="Passkey" value={passkeyAdded ? "1 passkey added" : "Use a passkey for faster, more secure sign-in"} actionLabel={passkeyAdded ? undefined : "Add"} onClick={() => setPasskeyAdded(true)} />
          </div>
        </section>
        <section className="rounded-[20px] bg-white p-5 sm:p-7">
          <SectionTitle title="Apps and sessions" description="Review the services and devices that can access your account." />
          <div className="mt-6 space-y-3">
            <SettingRow icon={LinkIcon} label="Connected apps" value="None" />
            <SettingRow icon={ShieldCheckIcon} label="Login activity" value="This device" />
          </div>
        </section>
        <section className="rounded-[20px] bg-white p-5 sm:p-7">
          <SectionTitle title="Delete your account" description="Remove your Creatorshop profile and account. Completed-shop receipts remain available to the other party for record-keeping." />
          <button type="button" onClick={() => setDeleteMode(true)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-red-600 underline decoration-red-200 underline-offset-4 transition-colors hover:text-red-700"><TrashIcon className="size-4" /> Delete account</button>
        </section>
      </div>

      {emailMode ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4 sm:p-6">
          <div role="dialog" aria-modal="true" aria-labelledby="change-email-title" aria-describedby="change-email-description" className="w-full max-w-[27rem] rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-7">
            <header>
              <h2 id="change-email-title" className="text-[1.375rem] leading-7 font-bold tracking-[-0.03em] text-neutral-950">Change email address</h2>
              {!emailRequested ? <p id="change-email-description" className="mt-2 text-pretty text-sm leading-6 text-neutral-500">For your security, we’ll verify the new email before changing your sign-in.</p> : null}
            </header>
            {emailRequested ? (
              <div id="change-email-description" className="mt-6 flex items-start gap-3 rounded-2xl bg-[#eef4e4] p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/80 text-neutral-900"><CheckIcon className="size-4 stroke-2" /></span>
                <div className="pt-0.5"><p className="text-sm leading-5 font-semibold text-neutral-950">Check your inbox</p><p className="mt-1.5 text-pretty text-sm leading-6 text-neutral-600">We sent a verification link to your new address. Your sign-in email will not change until you confirm it.</p></div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <label className="block text-[13px] leading-5 font-semibold text-neutral-800">New email address<input type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[15px] font-normal text-neutral-950 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10" /></label>
                <label className="block text-[13px] leading-5 font-semibold text-neutral-800">Current password<input type="password" autoComplete="current-password" placeholder="••••••••" className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[15px] font-normal text-neutral-950 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10" /></label>
              </div>
            )}
            <div className="mt-7 flex justify-end gap-2 pt-5">
              <ModalSecondaryAction onClick={() => setEmailMode(false)}>Cancel</ModalSecondaryAction>
              {!emailRequested ? <Button size="sm" onClick={() => setEmailRequested(true)}>Send verification</Button> : null}
            </div>
          </div>
        </div>
      ) : null}

      {passwordMode ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="change-password-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <h2 id="change-password-title" className="text-xl font-bold tracking-tight">Change password</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Use at least eight characters and choose something you do not use elsewhere.</p>
            <label className="mt-5 block text-xs font-semibold text-neutral-600">Current password<input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="••••••••" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label>
            <label className="mt-4 block text-xs font-semibold text-neutral-600">New password<input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="At least 8 characters" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label>
            <label className="mt-4 block text-xs font-semibold text-neutral-600">Confirm new password<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="Repeat your new password" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label>
            {confirmPassword && newPassword !== confirmPassword ? <p role="alert" className="mt-2 text-xs font-medium text-red-600">Passwords do not match.</p> : null}
            <div className="mt-6 flex justify-end gap-2"><ModalSecondaryAction onClick={closePasswordModal}>Cancel</ModalSecondaryAction><Button size="sm" disabled={!passwordIsValid} onClick={() => { setPasswordChanged(true); closePasswordModal(); }}>Update password</Button></div>
          </div>
        </div>
      ) : null}

      {deleteMode ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600"><ExclamationTriangleIcon className="size-6" /></span>
            <h2 id="delete-account-title" className="mt-5 text-xl font-bold tracking-tight">Delete your account?</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">This cannot be undone. You will lose access to your profile, saved products, messages, and shops. Type <strong className="font-semibold text-neutral-900">DELETE</strong> to continue.</p>
            <input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="DELETE" className="mt-5 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-red-500" />
            <div className="mt-6 flex justify-end gap-2"><ModalSecondaryAction onClick={() => { setDeleteMode(false); setDeleteText(""); }}>Keep account</ModalSecondaryAction><Button variant="danger" size="sm" disabled={deleteText !== "DELETE"}>Delete account</Button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

