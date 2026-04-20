interface PayWithPostsCardProps {
  creatorName?: string;
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[11px] h-[11px]">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[11px] h-[11px]">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.76a4.85 4.85 0 0 1-1.03-.07z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[11px] h-[11px]">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[11px] h-[11px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function PayWithPostsCard({ creatorName = "CREATOR NAME" }: PayWithPostsCardProps) {
  return (
    <div
      className="card-shine w-[340px] h-[214px] rounded-[20px] bg-white relative overflow-hidden flex-shrink-0 select-none cursor-default"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: [
          "0 0 0 0.5px rgba(0,0,0,0.05)",
          "0 2px 4px rgba(0,0,0,0.04)",
          "0 6px 20px rgba(0,0,0,0.07)",
          "0 20px 52px rgba(0,0,0,0.1)",
          "0 0 60px rgba(163,255,56,0.06)",
        ].join(", "),
      }}
    >

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[22px] py-[20px]">

        {/* Top row — logo mark + wordmark */}
        <div className="flex items-center gap-2.5">
          {/* Logo mark — lime container with the arrow icon */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#A3FF38",
              boxShadow: "0 1px 4px rgba(130,242,0,0.35)",
            }}
          >
            <svg viewBox="0 0 58 56" fill="none" style={{ width: 16, height: 16 }}>
              <path
                d="M45.659 27.311H31.892c-.587 0-.881-.707-.467-1.12l6.563-6.526a.75.75 0 000-1.061.75.75 0 00-1.063 0l-6.563 6.527c-.416.413-1.125.12-1.125-.465V11.109a.662.662 0 00-.662-.657.662.662 0 00-.663.657V24.8c0 .585-.711.877-1.125.465l-6.563-6.527a.75.75 0 00-1.062 0 .75.75 0 000 1.06l6.562 6.527c.415.414.12 1.12-.466 1.12H11.756a.662.662 0 00-.66.657c0 .361.295.656.66.656h13.767c.587 0 .881.707.466 1.12l-6.562 6.527a.75.75 0 000 1.06.75.75 0 001.062 0l6.563-6.527c.414-.413 1.125-.12 1.125.465v13.691c0 .362.296.657.663.657.366 0 .662-.294.662-.657V30.635c0-.585.711-.877 1.125-.465l6.563 6.527a.75.75 0 001.062 0 .75.75 0 000-1.06l-6.563-6.527c-.414-.413-.12-1.12.467-1.12H45.66a.662.662 0 00.66-.656.662.662 0 00-.66-.657z"
                fill="#1a1a1a"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-[3px]">
            <span
              className="text-[15px] text-neutral-900 leading-none"
              style={{ fontWeight: 800, letterSpacing: "-0.025em" }}
            >
              creator<span style={{ color: "#A3FF38" }}>shop</span>
            </span>
            <span
              className="text-[8.5px] text-neutral-400 leading-none"
              style={{ letterSpacing: "0.14em", fontStyle: "italic" }}
            >
              pay with posts
            </span>
          </div>
        </div>

        {/* Middle — chip row */}
        <div className="flex items-center gap-3">
          {/* EMV chip */}
          <div
            className="flex-shrink-0"
            style={{
              width: 44,
              height: 32,
              borderRadius: 5,
              background: "#A3FF38",
              backgroundImage: [
                "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
                "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 60%)",
              ].join(", "),
              backgroundSize: "33.33% 50%, 33.33% 50%, 100% 100%",
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.65), 0 2px 6px rgba(130,242,0,0.3)",
            }}
          />

          {/* Holographic strip — a signature bank card detail */}
          <div
            className="flex-shrink-0"
            style={{
              width: 13,
              height: 9,
              borderRadius: 2,
              background:
                "linear-gradient(120deg, #ff9ff3 0%, #feca57 22%, #48dbfb 45%, #ff6b81 68%, #54a0ff 100%)",
              opacity: 0.65,
              boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.6)",
            }}
          />
        </div>

        {/* Card number row */}
        <div
          className="font-mono leading-none"
          style={{ fontSize: 13.5, letterSpacing: "0.26em", color: "rgba(0,0,0,0.16)" }}
        >
          ●●●● ●●●● ●●●●{" "}
          <span style={{ color: "#1a5200", fontWeight: 700, letterSpacing: "0.22em" }}>
            POST
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">

          {/* Left — card fields */}
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-[3px]">
              <span
                className="text-neutral-300 uppercase leading-none"
                style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.16em" }}
              >
                Valid for
              </span>
              <span
                className="text-neutral-700 leading-none"
                style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em" }}
              >
                CONTENT
              </span>
            </div>

            {/* Vertical divider */}
            <div className="self-stretch w-px bg-neutral-100 mb-0.5" />

            <div className="flex flex-col gap-[3px]">
              <span
                className="text-neutral-300 uppercase leading-none"
                style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.16em" }}
              >
                Cardholder
              </span>
              <span
                className="text-neutral-700 uppercase leading-none"
                style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em" }}
              >
                {creatorName}
              </span>
            </div>
          </div>

          {/* Right — social platform cluster */}
          <div className="flex items-center">
            {[
              { bg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", el: <InstagramIcon /> },
              { bg: "#000000",                                          el: <TikTokIcon />   },
              { bg: "#FF0000",                                          el: <YouTubeIcon />  },
              { bg: "#111111",                                          el: <XIcon />        },
            ].map(({ bg, el }, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-white flex-shrink-0"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: bg,
                  border: "2px solid white",
                  marginLeft: i === 0 ? 0 : -8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                }}
              >
                {el}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
