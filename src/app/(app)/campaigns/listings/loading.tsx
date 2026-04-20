function RowSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-36 rounded-lg bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 rounded-full bg-gray-100" />
          <div className="h-8 w-24 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function ListingsLoading() {
  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-36 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-5 w-72 rounded-lg bg-gray-100 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
