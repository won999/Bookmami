"use client";

import { useActionState, useState } from "react";
import { addFamilyMemberAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const AVATAR_EMOJIS = ["📚", "🐿️", "🐻", "🐰", "🦊", "🐥", "🌸", "🍀"];

export function AddMemberForm() {
  const [state, formAction, pending] = useActionState(
    addFamilyMemberAction,
    undefined
  );
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="avatarEmoji" value={avatar} />

      <div className="flex flex-col gap-2">
        <Label>아이콘</Label>
        <div className="flex flex-wrap gap-2">
          {AVATAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors",
                avatar === emoji
                  ? "border-primary bg-primary/10"
                  : "border-input hover:bg-accent"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new-name">이름</Label>
        <Input id="new-name" name="name" placeholder="예: 아빠" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">비밀번호 (4자 이상)</Label>
        <Input
          id="new-password"
          name="password"
          type="password"
          required
          minLength={4}
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-1 w-fit">
        {pending ? "추가하는 중..." : "가족 추가하기"}
      </Button>
    </form>
  );
}
