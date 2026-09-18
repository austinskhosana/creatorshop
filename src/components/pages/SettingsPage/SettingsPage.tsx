"use client";

import { useState } from "react";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { AccountSettingsSection } from "./settings/AccountSettingsSection";
import { NotificationSettingsSection } from "./settings/NotificationSettingsSection";
import { ProfileSettingsSection } from "./settings/ProfileSettingsSection";
import { SettingsNav } from "./settings/SettingsNav";
import type { SettingsSection } from "./settings/types";

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("profile");

  return (
    <CreatorShell>
      <div className="min-h-[calc(100vh-5rem)] bg-white px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <header>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Settings</h1>
            <p className="mt-2 text-sm text-neutral-500">Manage your profile, preferences, and account security.</p>
          </header>

          <div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
            <SettingsNav active={section} onChange={setSection} />
            <main className="min-w-0">
              {section === "profile" ? <ProfileSettingsSection /> : null}
              {section === "notifications" ? <NotificationSettingsSection /> : null}
              {section === "account" ? <AccountSettingsSection /> : null}
            </main>
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}
