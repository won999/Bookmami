"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteLogAction } from "@/app/actions/logs";

export function DeleteLogButton({ logId }: { logId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        if (!confirm("이 기록을 정말 삭제할까요?")) return;
        startTransition(() => deleteLogAction(logId));
      }}
    >
      {isPending ? "삭제 중..." : "삭제"}
    </Button>
  );
}
