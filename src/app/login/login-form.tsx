"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FamilyMember } from "@/lib/types";

export function LoginForm({
  members,
  next,
}: {
  members: FamilyMember[];
  next: string;
}) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [memberId, setMemberId] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="memberId" value={memberId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="member">누구인가요?</Label>
        <Select value={memberId} onValueChange={(v) => setMemberId(v ?? "")}>
          <SelectTrigger id="member" className="w-full">
            <SelectValue placeholder="가족 선택" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.avatar_emoji} {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input id="password" name="password" type="password" required minLength={4} />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending || !memberId} className="mt-2">
        {pending ? "확인 중..." : "들어가기"}
      </Button>
    </form>
  );
}
