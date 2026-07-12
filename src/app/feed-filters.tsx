"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type FamilyMember, type ReadingStatus } from "@/lib/types";

export function FeedFilters({ members }: { members: FamilyMember[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member") ?? "all";
  const status = searchParams.get("status") ?? "all";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={memberId === "all"}
          onClick={() => updateParam("member", "all")}
        >
          전체 가족
        </FilterChip>
        {members.map((m) => (
          <FilterChip
            key={m.id}
            active={memberId === m.id}
            onClick={() => updateParam("member", m.id)}
          >
            {m.avatar_emoji} {m.name}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={status === "all"}
          onClick={() => updateParam("status", "all")}
        >
          전체 상태
        </FilterChip>
        {(Object.keys(STATUS_LABEL) as ReadingStatus[]).map((s) => (
          <FilterChip
            key={s}
            active={status === s}
            onClick={() => updateParam("status", s)}
          >
            {STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 font-medium text-primary"
          : "border-input text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
