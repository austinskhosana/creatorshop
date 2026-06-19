"use client";
// "use client" is needed because usePathname (which reads the current URL)
// only works in the browser, not on the server.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";

// ── Icon components ───────────────────────────────────────────────────────────
// Each one is a small SVG wrapped in a function so we can reuse it cleanly.

function HomeIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 21.75h6A2.25 2.25 0 0 0 21 19.5v-6.75h-8.25v9Z" />
    </svg>
  );
}

function ShopsIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0Zm6.75 0a2.25 2.25 0 1 0-4.5 0v.75h4.5V6Zm-9 7.5a.75.75 0 0 1 .75-.75h.75v-.75a.75.75 0 0 1 1.5 0v.75h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75H6a.75.75 0 0 1-.75-.75Zm9-.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

function CampaignsIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
    </svg>
  );
}

function InfluencersIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function BrandProfileIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H18.75a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H18.75Z" clipRule="evenodd" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

// ── Nav item type ─────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ("CREATOR" | "BRAND" | "BOTH")[];
};


// ── User profile ──────────────────────────────────────────────────────────────
function UserProfile() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("");

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-3 rounded-xl hover:bg-black/[0.03] transition-colors duration-[160ms]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#A3FF38] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-gray-900">
          {initials || "?"}
        </div>
        <span className="text-[14px] font-medium text-gray-700 truncate">{displayName}</span>
      </div>
      <button
        onClick={() => signOut({ redirectUrl: "/sign-in" })}
        title="Sign out"
        className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors duration-[160ms]"
      >
        <SignOutIcon />
      </button>
    </div>
  );
}

// ── Sidebar component ─────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as "CREATOR" | "BRAND" | "BOTH") ?? "CREATOR";

  const navItems: NavItem[] = [
    { id: "shop",          label: "Shop",       href: "/explore",       icon: <ShopIcon />,          roles: ["CREATOR", "BOTH"] },
    { id: "shops",         label: "My Shops",   href: "/shops",         icon: <ShopsIcon />,         roles: ["CREATOR", "BOTH"] },
    { id: "profile",       label: "Profile",    href: "/profile",       icon: <ProfileIcon />,       roles: ["CREATOR", "BOTH"] },
    { id: "brand-profile",  label: "Profile",      href: "/brand-profile",  icon: <BrandProfileIcon />,   roles: ["BRAND"]           },
    { id: "admin",          label: "Admin",        href: "/admin",          icon: <AdminIcon />,          roles: ["BRAND"]           },
    { id: "applications",   label: "Applications", href: "/applications",   icon: <ApplicationsIcon />,   roles: ["BRAND", "BOTH"]   },
    { id: "campaigns",      label: "Campaigns",    href: "/campaigns",      icon: <CampaignsIcon />,      roles: ["BRAND", "BOTH"]   },
    { id: "influencers",   label: "Creators",   href: "/influencers",   icon: <InfluencersIcon />,   roles: ["BRAND", "BOTH"]   },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    // The sidebar is a tall flex column with a light gray background.
    // h-screen makes it fill the full viewport height.
    <nav className="flex flex-col h-screen w-72 bg-[#FAFAFB] px-4 py-8 font-sans border-r border-black/[0.1]">

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="mb-10 px-2">
        <Logo height={40} />
      </div>

      {/* ── Nav items ────────────────────────────────────────────────────── */}
      {/* flex-1 makes this section grow to fill available space, pushing Sign Out to the bottom */}
      <ul className="flex flex-col gap-1 flex-1">
        {visibleItems.map((item, index) => {
          // Match "/" exactly so the Home link doesn't stay active on every page.
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            // Each item staggered 40ms apart — items cascade in rather than all appearing at once.
            // `both` fill-mode keeps the item invisible until its delay starts, preventing a flash.
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-[16px]",
                  // Specific properties only — no transition-all.
                  // Same cubic-bezier easing for every state change: instant start, smooth settle.
                  "border transition-[background-color,color,box-shadow,transform,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
                  // 0.96 is the correct scale-on-press value per design principle — tactile but not dramatic.
                  "active:scale-[0.96]",
                  isActive
                    // Two shadow layers: a tight ambient shadow + a wider diffused one.
                    // Layered shadows look far more natural than a single shadow.
                    ? "bg-white border-black/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.07)] text-gray-900 font-medium"
                    // Subtle background on hover gives the surface a chance to respond
                    // before the click — not just after.
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-black/[0.03]",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── User profile ─────────────────────────────────────────────────── */}
      <UserProfile />

    </nav>
  );
}
