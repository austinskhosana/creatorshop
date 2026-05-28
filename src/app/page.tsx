import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/explore");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}
