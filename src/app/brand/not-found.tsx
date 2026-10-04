import { NotFoundPage } from "@/components/pages/NotFoundPage";

export default function NotFound() {
  return <NotFoundPage action={{ label: "Browse creators", href: "/brand/creators" }} secondaryAction={{ label: "Back to storefront", href: "/brand" }} />;
}
