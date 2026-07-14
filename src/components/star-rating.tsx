"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_CLASS = "pointer-events-none";

export function StarRatingInput({
  value,
  onChange,
  className = "h-8 w-8",
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <div key={n} className={cn("relative", className)}>
            <Star
              className={cn(
                STAR_CLASS,
                "absolute inset-0 h-full w-full fill-transparent text-muted-foreground"
              )}
            />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={cn(STAR_CLASS, "h-full w-full fill-amber-400 text-amber-400")} />
            </div>
            <button
              type="button"
              aria-label={`별점 ${n - 0.5}점`}
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => onChange(value === n - 0.5 ? 0 : n - 0.5)}
            />
            <button
              type="button"
              aria-label={`별점 ${n}점`}
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => onChange(value === n ? 0 : n)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function StarRatingDisplay({
  value,
  className = "h-5 w-5",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <div key={n} className={cn("relative", className)}>
            <Star
              className={cn(
                STAR_CLASS,
                "absolute inset-0 h-full w-full fill-transparent text-muted-foreground/40"
              )}
            />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={cn(STAR_CLASS, "h-full w-full fill-amber-400 text-amber-400")} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
