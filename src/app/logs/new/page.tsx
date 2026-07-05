import { createLogAction } from "@/app/actions/logs";
import { LogForm } from "@/components/log-form";

export default function NewLogPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-xl font-bold">새 독서 기록</h1>
      <LogForm action={createLogAction} submitLabel="기록 저장하기" />
    </div>
  );
}
