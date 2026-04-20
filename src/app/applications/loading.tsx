export default function ApplicationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {/* Header skeleton */}
      <div className="w-full max-w-[440px] mb-8 space-y-2">
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" />
        <div className="h-1.5 w-full bg-gray-100 rounded-full animate-pulse mt-3" />
      </div>

      {/* Card stack skeleton */}
      <div className="relative w-[400px] h-[520px]">
        {/* Ghost cards */}
        <div
          className="absolute inset-0 bg-gray-50 rounded-2xl border border-gray-100"
          style={{ transform: "translateY(24px) scale(0.90)", zIndex: 10 }}
        />
        <div
          className="absolute inset-0 bg-gray-50 rounded-2xl border border-gray-100"
          style={{ transform: "translateY(12px) scale(0.95)", zIndex: 20 }}
        />
        {/* Active card */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5" style={{ zIndex: 30 }}>
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-gray-100 rounded-md animate-pulse" />
              <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
            <div className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
          {/* Pitch */}
          <div className="space-y-2 pl-3 border-l-2 border-gray-100">
            <div className="h-3.5 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-3.5 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-3.5 w-4/6 bg-gray-100 rounded animate-pulse" />
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[80, 64, 96, 72].map((w) => (
              <div key={w} className="h-7 bg-gray-100 rounded-xl animate-pulse" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center gap-6 mt-10">
        <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
        <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}
