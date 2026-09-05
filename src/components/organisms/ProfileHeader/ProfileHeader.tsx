interface ProfileHeaderProps {
  displayName: string;
  location?: string;
  audienceSize?: string;
  onEdit?: () => void;
}

export default function ProfileHeader({ displayName, location, audienceSize, onEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-[#A3FF38]/40 to-white px-8 pt-8 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-[#A3FF38]/40 bg-[#A3FF38]/30 text-[24px] font-bold text-[#2A6000]">
            {displayName ? displayName[0].toUpperCase() : "?"}
          </div>
          <div>
            <h1 className="text-[20px] leading-tight font-bold text-neutral-900">
              {displayName || <span className="text-gray-300">Your name</span>}
            </h1>
            {location && (
              <div className="mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-gray-400">
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[12px] text-gray-400">{location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {audienceSize && (
            <span className="rounded-full border border-[#82F200] bg-[#A3FF38] px-3 py-1.5 text-[12px] font-semibold text-gray-900 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
              {audienceSize} followers
            </span>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] transition-colors duration-[120ms] hover:border-gray-300 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gray-400">
                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
