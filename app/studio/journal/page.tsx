import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyStudioSessionToken, STUDIO_COOKIE_NAME } from "@/lib/studio/session";
import { StudioJournalClient } from "./StudioJournalClient";

export const dynamic = "force-dynamic";

export default async function StudioJournalPage() {
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_COOKIE_NAME)?.value;

  if (!verifyStudioSessionToken(token, expected)) {
    redirect("/studio-login");
  }

  return <StudioJournalClient />;
}
