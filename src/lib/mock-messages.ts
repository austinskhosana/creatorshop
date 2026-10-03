import type { MessageContent } from "@/components/molecules/MessageBubble";

/**
 * Fictional inbox for the /messages prototype. Brand names match the mock shops, but every
 * message below is invented — none of it is a real conversation.
 */

export type ChatMessage = {
  id: string;
  /** "them" is whoever is on the other side of the thread — a brand or the Creatorshop team. */
  from: "them" | "you";
  content: MessageContent;
  /** Day label the thread groups by, e.g. "Mon" or "Today". */
  day: string;
  time: string;
};

/** Who the thread is with. "team" is a Creatorshop staff account and shows the official badge. */
export type Participant = "brand" | "team";

export type InboxThread = {
  id: string;
  participant: Participant;
  name: string;
  detail: string;
  /** Without one, the thread shows the participant's initials. */
  image?: string;
  online?: boolean;
  unread?: boolean;
  messages: ChatMessage[];
};

const text = (value: string): MessageContent => ({ type: "text", text: value });

export const mockThreads: InboxThread[] = [
  {
    id: "paper",
    participant: "brand",
    name: "Paper",
    detail: "Paper Pro · Instagram carousel",
    image: "/logos/paper.jpeg",
    unread: true,
    messages: [
      { id: "p1", from: "you", day: "Yesterday", time: "4:12 PM", content: text("Hi Paper team! I've used Paper for my sketch-to-slide workflow for a while — would love to do a carousel on it.") },
      { id: "p2", from: "them", day: "Today", time: "10:40 AM", content: text("Hey! Loved your pitch — you're approved for Paper Pro.") },
      { id: "p3", from: "them", day: "Today", time: "10:41 AM", content: text("Your access code is in My Shops. Draft is due in 14 days.") },
      { id: "p4", from: "them", day: "Today", time: "10:42 AM", content: text("We're excited to see what you create.") },
    ],
  },
  {
    id: "canva",
    participant: "brand",
    name: "Canva",
    detail: "Canva Pro · Short-form video",
    image: "/logos/canva.jpg",
    unread: true,
    messages: [
      { id: "c1", from: "you", day: "Mon", time: "9:05 AM", content: text("First draft is uploaded — it's a 30s walkthrough of Magic Resize.") },
      { id: "c2", from: "them", day: "Yesterday", time: "2:18 PM", content: text("Thanks! Really like the pacing in the first 10 seconds.") },
      { id: "c3", from: "them", day: "Yesterday", time: "2:20 PM", content: text("Could you show the export step on screen instead of saying it? Otherwise good to go.") },
      { id: "c4", from: "them", day: "Yesterday", time: "2:20 PM", content: text("We left feedback on your draft.") },
    ],
  },
  {
    id: "notion",
    participant: "brand",
    name: "Notion",
    detail: "Notion Plus · Product tutorial",
    image: "/logos/notion.jpg",
    messages: [
      { id: "n1", from: "them", day: "Mon", time: "11:30 AM", content: text("Your draft is approved — go ahead and post whenever you're ready.") },
      { id: "n2", from: "you", day: "Tue", time: "8:47 AM", content: text("Posted this morning! Proof link is attached in My Shops.") },
      { id: "n3", from: "them", day: "Tue", time: "9:15 AM", content: text("Thanks for sending that over!") },
    ],
  },
  {
    id: "elevenlabs",
    participant: "brand",
    name: "ElevenLabs",
    detail: "Creator program",
    image: "/logos/elevenlabs.png",
    messages: [
      { id: "e1", from: "them", day: "Mon", time: "3:02 PM", content: text("Welcome to the creator program. Your access is ready to use.") },
    ],
  },
  {
    id: "support",
    participant: "team",
    name: "Austin at Creatorshop",
    detail: "Creatorshop support",
    image: "/Creatorshop Brand Symbol.webp",
    online: true,
    messages: [
      { id: "s1", from: "them", day: "Fri", time: "12:10 PM", content: text("Hi, welcome to Creatorshop 👋") },
      { id: "s2", from: "them", day: "Fri", time: "12:10 PM", content: text("How can we help with your shop?") },
    ],
  },
];

/** One-line preview for the inbox row, prefixed with "You:" when you sent the last message. */
export function previewFor(message: ChatMessage | undefined) {
  if (!message) return "No messages yet";
  const body =
    message.content.type === "text" ? message.content.text : message.content.type === "gif" ? "Sent a GIF" : "Sent a photo";
  return message.from === "you" ? `You: ${body}` : body;
}

/** Timestamp for the inbox row: the time for today's messages, otherwise the day label. */
export function inboxTimeFor(message: ChatMessage | undefined) {
  if (!message) return "";
  return message.day === "Today" ? message.time : message.day;
}
