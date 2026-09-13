import { FAQItem } from "@/components/molecules/FAQItem";

const FAQS = [
  {
    question: "How does Creatorshop actually work?",
    answer:
      "Browse software subscription listings, apply to shop, and if the brand approves, create and deliver the content to pay with a post. No cash involved.",
  },
  {
    question: "Do I need a huge following to apply?",
    answer:
      "No minimum follower count. Brands pick based on fit for their software subscription, not just your numbers.",
  },
  {
    question: "What happens if my application isn't picked?",
    answer:
      "Nothing bad happens. You just browse the next drop. No cost, no card on file, no risk.",
  },
  {
    question: "How do I actually get paid?",
    answer:
      "You pay with a post, not cash. Deliver the content you agreed on, and the subscription that would've cost you money is yours.",
  },
  {
    question: "Is this only for software brands right now?",
    answer:
      "For now, yes. We're launching focused on software subscription drops, with more categories on the way.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-white px-6 pt-16 pb-48 text-center sm:px-10 lg:px-16">
      <h2 className="font-pixel text-2xl leading-tight text-neutral-900 sm:text-3xl">FAQ</h2>
      <div className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-4 text-left">
        {FAQS.map((faq) => (
          <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
