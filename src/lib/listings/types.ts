export interface Listing {
  slug: string;
  brandName: string;
  websiteUrl?: string;
  title: string;
  description: string;
  deliverables: string[];
  retailValue: number;
  months: number;
  slotsRemaining: number;
  totalSlots: number;
  category?: string | null;
  platform?: string | null;
  saved?: boolean;
}
