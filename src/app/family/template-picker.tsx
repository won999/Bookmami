"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateDefaultTemplateAction } from "@/app/actions/family";
import { TEMPLATE_LABEL, type CardTemplate } from "@/lib/types";
import { cn } from "@/lib/utils";

const TEMPLATES = Object.keys(TEMPLATE_LABEL) as CardTemplate[];

export function TemplatePicker({ current }: { current: CardTemplate }) {
  const [selected, setSelected] = useState(current);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-1">
      {TEMPLATES.map((t) => (
        <button
          key={t}
          type="button"
          disabled={isPending}
          onClick={() => {
            setSelected(t);
            startTransition(async () => {
              const result = await updateDefaultTemplateAction(t);
              if (result?.error) toast.error(result.error);
              else toast.success("기본 카드 스타일을 저장했어요");
            });
          }}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs transition-colors",
            selected === t
              ? "border-primary bg-primary/10 text-primary"
              : "border-input text-muted-foreground hover:bg-accent"
          )}
        >
          {TEMPLATE_LABEL[t]}
        </button>
      ))}
    </div>
  );
}
