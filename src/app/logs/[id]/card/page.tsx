import { notFound } from "next/navigation";
import { getReadingLogById, getFamilyMemberById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { CardView } from "./card-view";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [log, session] = await Promise.all([getReadingLogById(id), getSession()]);
  if (!log) notFound();

  const viewer = session ? await getFamilyMemberById(session.memberId) : null;
  const defaultTemplate = viewer?.default_template ?? "cover-rating";

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-1 text-xl font-bold">인스타용 카드</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        스타일을 고르고, 다운로드하거나 바로 공유해서 원하는 계정에 올려보세요.
      </p>
      <CardView logId={log.id} defaultTemplate={defaultTemplate} title={log.title} />
    </div>
  );
}
