import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";

interface AccessTicketProps {
  brand: string;
  product: string;
  slug: string;
  access: string;
  className?: string;
}

function TicketNotches() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-white" />
      <span aria-hidden="true" className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-white" />
    </>
  );
}

export default function AccessTicket({ brand, product, slug, access, className }: AccessTicketProps) {
  return (
    <div className={`relative mx-auto h-52 w-80 sm:h-56 sm:w-96 ${className ?? ""}`}>
      <div className="relative size-full">
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <TicketNotches />
          <div className="flex items-center gap-3.5">
            <BrandLogo slug={slug} name={brand} size={42} />
            <div className="min-w-0 text-left">
              <p className="truncate text-[15px] font-semibold text-neutral-950 leading-tight">{product}</p>
              <p className="text-sm text-neutral-400 leading-tight">{brand}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-3.5">
            <span className="text-[11px] font-medium tracking-[0.1em] text-neutral-400 uppercase">Access pass</span>
            <span className="text-[11px] font-semibold tracking-[0.1em] text-neutral-950 uppercase">{access}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
