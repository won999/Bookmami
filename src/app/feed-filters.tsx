"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABEL, type FamilyMember, type ReadingStatus } from "@/lib/types";

export function FeedFilters({ members }: { members: FamilyMember[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member") ?? "all";
  const status = searchParams.get("status") ?? "all";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <Select value={memberId} onValueChange={(v) => updateParam("member", v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="가족" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 가족</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.avatar_emoji} {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => updateParam("status", v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          {(Object.keys(STATUS_LABEL) as ReadingStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
