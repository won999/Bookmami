"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
        <Label>누구인가요?</Label>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMemberId(m.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                memberId === m.id
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              <span className="text-base">{m.avatar_emoji}</span>
              {m.name}
            </button>
          ))}
        </div>
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
