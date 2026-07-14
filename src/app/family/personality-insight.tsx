"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { analyzeReadingPersonalityAction } from "@/app/actions/insights";

export function PersonalityInsight({
  memberId,
  logCount,
  minLogs,
  personality,
  updatedAt,
}: {
  memberId: string;
  logCount: number;
  minLogs: number;
  personality: string | null;
  updatedAt: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  if (logCount < minLogs) {
    return (
      <p className="text-xs text-muted-foreground">
        기록이 {minLogs}개 이상 쌓이면 취향을 분석해드려요 ({logCount}/{minLogs})
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {personality && (
        <p className="text-sm leading-relaxed text-foreground/90">{personality}</p>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await analyzeReadingPersonalityAction(memberId);
              if (result?.error) toast.error(result.error);
              else toast.success("독서 취향을 분석했어요");
            })
          }
        >
          {isPending ? "분석 중..." : personality ? "다시 분석하기" : "취향 분석하기"}
        </Button>
        {updatedAt && (
          <span className="text-[11px] text-muted-foreground">
            {new Date(updatedAt).toLocaleDateString("ko-KR")} 분석
          </span>
        )}
      </div>
    </div>
  );
}
