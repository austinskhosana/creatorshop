import { BanknotesIcon } from "@heroicons/react/24/outline";
import { MoneyStack } from "@/components/atoms/MoneyStack";
import { TicketCard } from "@/components/molecules/TicketCard";

interface PromoBannerProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PromoBanner({ eyebrow, title, description }: PromoBannerProps) {
  return (
    <TicketCard
      icon={<BanknotesIcon strokeWidth={1.75} />}
      eyebrow={eyebrow}
      title={title}
      description={description}
      admit="Content as cash"
      art={<MoneyStack />}
      serial="NO. 000001"
      sansLabels
      size="large"
    />
  );
}
