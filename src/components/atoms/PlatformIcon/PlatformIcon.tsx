interface IconProps {
  className?: string;
}

function InstagramIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3-2.4 5.4-5.4 5.4S5.7 17.6 5.7 14.6c0-2.8 2.1-5.1 4.8-5.4v2.7c-1.3.2-2.3 1.4-2.3 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7V3h3Z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.5v5l4.5-2.5Z" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19 9.46 12.504h-7.406l-5.8-7.584-6.64 7.584H.479l8.6-9.83L.01 1.154h7.594l5.243 6.932 6.054-6.932Zm-1.29 19.674h2.039L6.496 3.042H4.307z" />
    </svg>
  );
}

interface PlatformIconProps extends IconProps {
  /** Any string that starts with a platform name, e.g. "TikTok", "YouTube review", "IG carousel". */
  platform: string;
}

export default function PlatformIcon({ platform, className }: PlatformIconProps) {
  const key = platform.split(" ")[0];
  if (key === "IG" || key === "Instagram") return <InstagramIcon className={className} />;
  if (key === "TikTok") return <TikTokIcon className={className} />;
  if (key === "YouTube") return <YouTubeIcon className={className} />;
  if (key === "X") return <XIcon className={className} />;
  return null;
}
