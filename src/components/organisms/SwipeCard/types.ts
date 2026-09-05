export type Platform = "Instagram" | "TikTok" | "YouTube" | "X" | "LinkedIn" | "Other";

export type Application = {
  id: string;
  creatorId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  pitch: string;
  niches: string[];
  services: string[];
  audienceSize: string | null;
  deliverable: string;
  platform: Platform;
  listingName: string;
  appliedAt: string;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  status: "PENDING" | "APPROVED" | "DENIED";
};
