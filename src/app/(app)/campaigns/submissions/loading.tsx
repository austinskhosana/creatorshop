function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-gray-100 bg-white p-3 gap-3 animate-pulse">
      <div className="h-36 rounded-2xl bg-gray-100" />
      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-28 rounded-lg bg-gray-100" />
          <div className="h-5 w-16 rounded-full bg-gray-100" />
        </div>
        <div className="h-4 w-36 rounded-lg bg-gray-100" />
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="h-3 w-32 rounded bg-gray-100" />
          <div className="h-3 w-16 rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 rounded-xl bg-gray-100" />
        <div className="flex-1 h-10 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function SubmissionsLoading() {
  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">

        <div className="flex flex-col gap-1 mb-6">
          <div className="h-8 w-40 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-5 w-72 rounded-lg bg-gray-100 animate-pulse" />
        </div>

        <div className="h-10 w-72 rounded-xl border border-gray-100 bg-gray-50 animate-pulse mb-8" />

        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
