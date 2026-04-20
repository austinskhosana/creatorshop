import Link from "next/link";

// ── Colour palette for creator cards ─────────────────────────────────────────
const CARDS = [
  {
    platform: "Instagram",
    label: "REELS CARD",
    handle: "@yourcreatorname",
    reach: "48.2K",
    bg: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
    chipColor: "rgba(255,255,255,0.25)",
    rotate: "-14deg",
    delay: "0s",
    z: 10,
    translateX: "-32px",
    translateY: "16px",
  },
  {
    platform: "TikTok",
    label: "VIDEO CARD",
    handle: "@yourcreatorname",
    reach: "112K",
    bg: "linear-gradient(135deg, #010101 0%, #1a1a2e 100%)",
    chipColor: "rgba(105,201,201,0.35)",
    rotate: "-5deg",
    delay: "0.15s",
    z: 20,
    translateX: "-12px",
    translateY: "6px",
  },
  {
    platform: "YouTube",
    label: "CONTENT CARD",
    handle: "@yourcreatorname",
    reach: "24.5K",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2d0000 100%)",
    chipColor: "rgba(255,80,80,0.35)",
    rotate: "5deg",
    delay: "0.3s",
    z: 30,
    translateX: "12px",
    translateY: "-6px",
  },
];

const SOFTWARE = [
  "Notion", "Figma", "CapCut", "Mailchimp", "Buffer",
  "Descript", "Linear", "Loom", "Webflow", "Framer",
  "Notion", "Figma", "CapCut", "Mailchimp", "Buffer",
  "Descript", "Linear", "Loom", "Webflow", "Framer",
];

const EXCHANGES = [
  { deliverable: "1 Instagram Reel",    software: "Notion Plus",      months: 3, value: 48,  platform: "IG"  },
  { deliverable: "1 TikTok Video",      software: "Figma Professional",months: 1, value: 15, platform: "TT"  },
  { deliverable: "2 Instagram Stories", software: "CapCut Pro",        months: 2, value: 20, platform: "IG"  },
  { deliverable: "1 YouTube Video",     software: "Descript Creator",  months: 6, value: 72, platform: "YT"  },
  { deliverable: "1 LinkedIn Post",     software: "Buffer Essentials",  months: 3, value: 36, platform: "LI" },
];

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <span className="text-[17px] font-bold tracking-tight text-neutral-900">
        creator<span className="text-[#A3FF38]">shop</span>
      </span>
      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-[120ms]"
        >
          Sign in
        </Link>
        <Link
          href="/onboarding"
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-[14px] font-semibold hover:opacity-90 transition-opacity duration-[120ms]"
        >
          Get early access
        </Link>
      </div>
    </nav>
  );
}

// ── Creator card ──────────────────────────────────────────────────────────────

function CreatorCard({
  platform, label, handle, reach, bg, chipColor,
  rotate, delay, z, translateX, translateY,
}: (typeof CARDS)[0]) {
  return (
    <div
      className="animate-float absolute w-64 h-40 rounded-2xl p-5 flex flex-col justify-between cursor-default select-none shadow-2xl"
      style={{
        background: bg,
        transform: `rotate(${rotate}) translate(${translateX}, ${translateY})`,
        zIndex: z,
        animationDelay: delay,
        animationDuration: `${5.5 + parseFloat(delay) * 2}s`,
        ["--card-rotate" as string]: rotate,
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest text-white/60 uppercase">
          Creatorshop
        </span>
        <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Chip */}
      <div
        className="w-8 h-6 rounded-[4px]"
        style={{ background: chipColor, border: "1px solid rgba(255,255,255,0.2)" }}
      />

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
            Reach
          </span>
          <span className="text-[15px] font-bold text-white tracking-wide">
            {reach}
          </span>
          <span className="text-[11px] text-white/60">{handle}</span>
        </div>
        <span className="text-[13px] font-bold text-white/80">{platform}</span>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

        {/* Copy */}
        <div className="flex-1 flex flex-col gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#EDFFD0] border border-[#A3FF38]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
            <span className="text-[12px] font-semibold text-[#2A6000] uppercase tracking-wider">
              Content is currency
            </span>
          </div>

          <h1 className="text-[64px] lg:text-[80px] font-bold leading-[1.0] tracking-tight text-neutral-900">
            Your posts have{" "}
            <span
              className="relative inline-block"
              style={{ WebkitTextStroke: "0px" }}
            >
              <span className="relative z-10">purchasing</span>
              <span
                className="absolute bottom-1 left-0 right-0 h-5 -z-0 rounded-sm"
                style={{ background: "#A3FF38" }}
              />
            </span>
            {" "}power.
          </h1>

          <p className="text-[18px] text-gray-500 leading-relaxed max-w-lg">
            Every Reel, every TikTok, every review — it&apos;s worth something.
            Creatorshop is where you spend it. Apply for software subscriptions
            and pay with content, not cash.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="px-6 py-3.5 rounded-2xl bg-neutral-900 text-white text-[15px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms]"
            >
              Start spending your content
            </Link>
            <Link
              href="/onboarding"
              className="px-6 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-[140ms]"
            >
              List your software →
            </Link>
          </div>

          <p className="text-[13px] text-gray-400">
            You&apos;ve been paid in likes. We think you deserve more.
          </p>
        </div>

        {/* Card wallet */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-72 h-52">
            {CARDS.map((card) => (
              <CreatorCard key={card.platform} {...card} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Software marquee ──────────────────────────────────────────────────────────

function SoftwareMarquee() {
  return (
    <section className="py-10 border-y border-gray-100 overflow-hidden bg-gray-50/50">
      <p className="text-center text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-6">
        Software available on Creatorshop
      </p>
      <div className="flex overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {SOFTWARE.map((name, i) => (
            <span
              key={i}
              className="text-[15px] font-semibold text-gray-300 hover:text-gray-500 transition-colors duration-[200ms] cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function BankNote({
  step, title, description, denomination,
}: {
  step: number; title: string; description: string; denomination: string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#c8f070] bg-[#EDFFD0] p-7 flex flex-col gap-4">

      {/* Guilloche lines — decorative */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #2A6000,
            #2A6000 1px,
            transparent 1px,
            transparent 8px
          )`,
        }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold tracking-widest text-[#2A6000]/50 uppercase">
            Creatorshop Exchange
          </span>
          <span className="text-[13px] font-semibold text-[#2A6000]/70">
            {denomination}
          </span>
        </div>
        <span className="text-[48px] font-black text-[#2A6000]/10 leading-none -mt-2">
          {step}
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-1.5">
        <h3 className="text-[18px] font-bold text-[#1a4a00]">{title}</h3>
        <p className="text-[14px] text-[#2A6000]/70 leading-relaxed">{description}</p>
      </div>

      {/* Fine print */}
      <p className="relative text-[10px] text-[#2A6000]/40 font-medium tracking-wide mt-auto pt-2 border-t border-[#A3FF38]/40">
        Legal tender for software subscriptions · Backed by authentic creator reach
      </p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        <div className="flex flex-col gap-2 max-w-lg">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400">
            How it works
          </p>
          <h2 className="text-[42px] font-bold text-neutral-900 leading-tight tracking-tight">
            Three steps to spend your content.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <BankNote
            step={1}
            denomination="One Browse"
            title="Find your software"
            description="Browse listings from software brands offering free subscriptions in exchange for content. Filter by category, plan value, or deliverable type."
          />
          <BankNote
            step={2}
            denomination="One Pitch"
            title="Apply with your content"
            description="Submit your application — what you'll create and why you're the right fit. No negotiating, no back-and-forth. The brand approves or passes."
          />
          <BankNote
            step={3}
            denomination="One Delivery"
            title="Get access. Create. Done."
            description="Approved? Your access key is revealed instantly. Use the software, post your content, submit the link. Shop complete."
          />
        </div>

      </div>
    </section>
  );
}

// ── Exchange rates ────────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  IG: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
  TT: "linear-gradient(135deg, #010101, #1a1a2e)",
  YT: "linear-gradient(135deg, #1a1a1a, #2d0000)",
  LI: "linear-gradient(135deg, #003d6b, #0077b5)",
};

function ExchangeRates() {
  return (
    <section className="py-24 px-6 bg-neutral-900">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-neutral-500">
            The exchange rate
          </p>
          <h2 className="text-[42px] font-bold text-white leading-tight tracking-tight">
            Know exactly what your content is worth.
          </h2>
          <p className="text-[16px] text-neutral-400 max-w-md">
            Every listing shows you the deal upfront. No surprises. Your audience is your balance.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {EXCHANGES.map((ex, i) => (
            <div
              key={i}
              className="flex items-center gap-5 rounded-2xl border border-neutral-800 bg-neutral-800/50 p-5 group hover:border-neutral-600 transition-all duration-[200ms]"
            >
              {/* Platform dot */}
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: PLATFORM_COLORS[ex.platform] }}
              >
                {ex.platform}
              </div>

              {/* Deliverable */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white">{ex.deliverable}</p>
                <p className="text-[13px] text-neutral-500">You create this</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-neutral-600 group-hover:text-[#A3FF38] transition-colors duration-[200ms]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Software */}
              <div className="flex-1 min-w-0 text-right">
                <p className="text-[15px] font-semibold text-white">{ex.software}</p>
                <p className="text-[13px] text-neutral-500">{ex.months} month{ex.months > 1 ? "s" : ""} free</p>
              </div>

              {/* Value pill */}
              <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#A3FF38]/10 border border-[#A3FF38]/20">
                <span className="text-[13px] font-semibold text-[#A3FF38]">${ex.value} value</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Creator section ───────────────────────────────────────────────────────────

function CreatorSection() {
  const perks = [
    { label: "No cash required",       sub: "Your content is the payment. Full stop." },
    { label: "Access key on approval", sub: "No waiting. Approved means instant access." },
    { label: "One shop at a time",     sub: "Apply, deliver, move on. Clean and simple." },
    { label: "Your audience, your capital", sub: "100 followers or 100K — every creator has value." },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#EDFFD0] border border-[#A3FF38]">
            <span className="text-[12px] font-semibold text-[#2A6000] uppercase tracking-wider">For Creators</span>
          </div>
          <h2 className="text-[42px] font-bold text-neutral-900 leading-tight tracking-tight">
            You&apos;ve been posting for free.
            <br />
            <span className="text-[#A3FF38]" style={{ WebkitTextStroke: "1px #2A6000" }}>
              Start spending it.
            </span>
          </h2>
          <p className="text-[16px] text-gray-500 leading-relaxed">
            Brands want what you already make — authentic content from real creators
            who actually use their product. Your audience is your bank account.
            Creatorshop is the exchange.
          </p>
          <Link
            href="/onboarding"
            className="self-start px-6 py-3.5 rounded-2xl bg-neutral-900 text-white text-[15px] font-semibold hover:opacity-90 transition-opacity duration-[140ms]"
          >
            Apply as a creator
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {perks.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4"
            >
              <div className="w-5 h-5 rounded-full bg-[#A3FF38] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#2A6000]">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900">{p.label}</p>
                <p className="text-[13px] text-gray-500">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Brand section ─────────────────────────────────────────────────────────────

function BrandSection() {
  const perks = [
    { label: "Real creators, real audiences",   sub: "Not influencer agencies. Actual people who want your product." },
    { label: "You set the terms",              sub: "Define exactly what you want. Approve or pass — no negotiation." },
    { label: "Keys delivered automatically",   sub: "On approval, the creator gets access. You get content. Done." },
    { label: "No delivery, no cost",           sub: "Creator doesn't post? Shop is revoked. You keep your key." },
  ];

  return (
    <section className="py-28 px-6 bg-gray-50/60">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="grid grid-cols-1 gap-3 order-2 lg:order-1">
          {perks.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4"
            >
              <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900">{p.label}</p>
                <p className="text-[13px] text-gray-500">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
            <span className="text-[12px] font-semibold text-white uppercase tracking-wider">For Brands</span>
          </div>
          <h2 className="text-[42px] font-bold text-neutral-900 leading-tight tracking-tight">
            Real content from creators who actually want your product.
          </h2>
          <p className="text-[16px] text-gray-500 leading-relaxed">
            Creators apply because they want your software. That means
            authentic posts, genuine audiences, and zero wasted budget on
            creators who aren&apos;t a fit.
          </p>
          <Link
            href="/onboarding"
            className="self-start px-6 py-3.5 rounded-2xl bg-neutral-900 text-white text-[15px] font-semibold hover:opacity-90 transition-opacity duration-[140ms]"
          >
            List your software
          </Link>
        </div>

      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDFFD0] border border-[#A3FF38]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
          <span className="text-[12px] font-semibold text-[#2A6000] uppercase tracking-wider">
            Now in early access
          </span>
        </div>
        <h2 className="text-[52px] font-bold text-neutral-900 leading-[1.05] tracking-tight">
          Your audience is your bank account.
        </h2>
        <p className="text-[17px] text-gray-500 leading-relaxed">
          Stop paying for the tools you need to grow. You&apos;ve already earned them.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="px-7 py-4 rounded-2xl bg-neutral-900 text-white text-[15px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms]"
          >
            Start spending your content
          </Link>
        </div>
        <p className="text-[13px] text-gray-400">
          Free for creators. Always.
        </p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-8 py-8 border-t border-gray-100 flex items-center justify-between">
      <span className="text-[15px] font-bold tracking-tight text-neutral-900">
        creator<span className="text-[#A3FF38]">shop</span>
      </span>
      <p className="text-[13px] text-gray-400">
        © {new Date().getFullYear()} Creatorshop. Content is currency.
      </p>
      <div className="flex items-center gap-5">
        <Link href="/explore" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms]">Explore</Link>
        <Link href="/sign-in" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms]">Sign in</Link>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SoftwareMarquee />
      <HowItWorks />
      <ExchangeRates />
      <CreatorSection />
      <BrandSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
