"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABEL,
  GENRES,
  STATUS_LABEL,
  type ReadingFormat,
  type ReadingLog,
  type ReadingStatus,
} from "@/lib/types";
import type { LogActionState } from "@/app/actions/logs";

type Action = (
  state: LogActionState,
  formData: FormData
) => Promise<LogActionState>;

export function LogForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: ReadingLog;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [status, setStatus] = useState<ReadingStatus>(initial?.status ?? "want");
  const [format, setFormat] = useState<ReadingFormat>(initial?.format ?? "paper");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [recommend, setRecommend] = useState<string>(
    initial?.recommend === true
      ? "true"
      : initial?.recommend === false
        ? "false"
        : ""
  );
  const [genre, setGenre] = useState(initial?.genre ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="format" value={format} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="recommend" value={recommend} />
      <input type="hidden" name="genre" value={genre} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cover">책 표지 사진</Label>
          <Input id="cover" name="cover" type="file" accept="image/*" capture="environment" />
          {initial?.cover_url && (
            <p className="text-xs text-muted-foreground">
              기존 사진이 있어요. 새로 올리면 교체돼요.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="photo">내 인증샷 (선택)</Label>
          <Input id="photo" name="photo" type="file" accept="image/*" capture="environment" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">책 제목</Label>
        <Input id="title" name="title" required defaultValue={initial?.title} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="author">저자</Label>
          <Input id="author" name="author" defaultValue={initial?.author ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="publisher">출판사</Label>
          <Input id="publisher" name="publisher" defaultValue={initial?.publisher ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>장르</Label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(genre === g ? "" : g)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                genre === g
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>진행 상태</Label>
        <div className="flex gap-2">
          {(Object.keys(STATUS_LABEL) as ReadingStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                status === s
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>읽은 형태</Label>
        <div className="flex gap-2">
          {(Object.keys(FORMAT_LABEL) as ReadingFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                format === f
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {FORMAT_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>별점</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(rating === n ? 0 : n)}
              aria-label={`별점 ${n}점`}
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  n <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startedAt">읽기 시작한 날</Label>
          <Input
            id="startedAt"
            name="startedAt"
            type="date"
            defaultValue={initial?.started_at ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="finishedAt">다 읽은 날</Label>
          <Input
            id="finishedAt"
            name="finishedAt"
            type="date"
            defaultValue={initial?.finished_at ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="oneLineReview">한줄평</Label>
        <Input
          id="oneLineReview"
          name="oneLineReview"
          placeholder="이 책을 한 문장으로 말하면?"
          defaultValue={initial?.one_line_review ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quote">인상 깊은 구절</Label>
        <Textarea
          id="quote"
          name="quote"
          rows={3}
          defaultValue={initial?.quote ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="힐링, 육아, 재독"
          defaultValue={initial?.tags?.join(", ") ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>다른 가족에게 추천할까요?</Label>
        <div className="flex gap-2">
          {[
            { value: "true", label: "추천해요 👍" },
            { value: "false", label: "아쉬워요 👎" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setRecommend(recommend === opt.value ? "" : opt.value)
              }
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                recommend === opt.value
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "저장 중..." : submitLabel}
      </Button>
    </form>
  );
}
