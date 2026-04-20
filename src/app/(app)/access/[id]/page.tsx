import { redirect } from "next/navigation";

export default function AccessPage({ params }: { params: { id: string } }) {
  redirect(`/shops/${params.id}`);
}
