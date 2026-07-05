import { notFound, redirect } from "next/navigation";
import { getReadingLogRaw } from "@/lib/data";
import { getSession } from "@/lib/session";
import { updateLogAction } from "@/app/actions/logs";
import { LogForm } from "@/components/log-form";

export default async function EditLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [log, session] = await Promise.all([getReadingLogRaw(id), getSession()]);

  if (!log) notFound();
  if (!session || session.memberId !== log.member_id) redirect(`/logs/${id}`);

  const boundAction = updateLogAction.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-xl font-bold">독서 기록 수정</h1>
      <LogForm action={boundAction} initial={log} submitLabel="수정 완료" />
    </div>
  );
}
