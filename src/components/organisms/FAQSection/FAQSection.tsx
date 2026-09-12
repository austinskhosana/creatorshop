import { FAQItem } from "@/components/molecules/FAQItem";

const FAQS = [
  {
    question: "How does Creatorshop actually work?",
    answer:
      "Browse a software drop, pitch your reach, and if the brand's into it, you create the content and deliver it. Access unlocked — no cash involved.",
  },
  {
    question: "Do I need a huge following to apply?",
    answer:
      "No minimum follower count. Brands pick based on fit for their software, not just your numbers.",
  },
  {
    question: "What happens if my pitch isn't picked?",
    answer:
      "Nothing bad — you just browse the next drop. No cost, no card on file, no risk.",
  },
  {
    question: "How do I actually get paid?",
    answer:
      "You're paid in access, not cash. Deliver the content you agreed on, and the software's yours.",
  },
  {
    question: "Is this only for software brands right now?",
    answer:
      "For now, yes — we're launching focused on software drops. More categories are on the way.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-white px-6 pt-16 pb-48 text-center sm:px-10 lg:px-16">
      <h2 className="text-2xl leading-tight font-medium text-neutral-900 sm:text-3xl">FAQ</h2>
      <div className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-4 text-left">
        {FAQS.map((faq) => (
          <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
