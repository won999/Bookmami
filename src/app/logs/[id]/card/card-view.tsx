"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEMPLATE_LABEL, type CardTemplate } from "@/lib/types";

const TEMPLATES = Object.keys(TEMPLATE_LABEL) as CardTemplate[];

export function CardView({
  logId,
  defaultTemplate,
  title,
}: {
  logId: string;
  defaultTemplate: CardTemplate;
  title: string;
}) {
  const [template, setTemplate] = useState<CardTemplate>(defaultTemplate);
  const [busy, setBusy] = useState(false);
  const imageUrl = `/logs/${logId}/card/${template}`;

  async function fetchImageBlob() {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error("이미지를 만들지 못했어요.");
    return res.blob();
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const blob = await fetchImageBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookmami-${title}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("다운로드하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    setBusy(true);
    try {
      const blob = await fetchImageBlob();
      const file = new File([blob], `bookmami-${title}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "책방아줌마 · Bookmami",
          text: title,
        });
      } else {
        await handleDownload();
        toast.info("이 기기는 공유를 지원하지 않아 다운로드했어요. 인스타 앱에서 직접 올려주세요.");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("공유하지 못했어요.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTemplate(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              template === t
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-input hover:bg-accent"
            )}
          >
            {TEMPLATE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={template}
          src={imageUrl}
          alt={`${title} 인스타 카드 미리보기`}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleShare} disabled={busy} className="flex-1" size="lg">
          {busy ? "준비 중..." : "공유하기"}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={busy}
          variant="outline"
          size="lg"
        >
          다운로드
        </Button>
      </div>
    </div>
  );
}
