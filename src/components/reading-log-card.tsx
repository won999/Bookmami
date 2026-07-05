import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type ReadingLogWithMember } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReadingLogCard({ log }: { log: ReadingLogWithMember }) {
  return (
    <Link
      href={`/logs/${log.id}`}
      className="flex gap-3 rounded-xl border bg-background p-3 transition-shadow hover:shadow-sm"
    >
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {log.cover_url ? (
          <Image
            src={log.cover_url}
            alt={log.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">
            📕
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{log.family_members.avatar_emoji}</span>
          <span>{log.family_members.name}</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {STATUS_LABEL[log.status]}
          </Badge>
        </div>
        <h3 className="truncate font-semibold">{log.title}</h3>
        {log.author && (
          <p className="truncate text-xs text-muted-foreground">{log.author}</p>
        )}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn(
                "h-3.5 w-3.5",
                n <= log.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          ))}
        </div>
        {log.one_line_review && (
          <p className="truncate text-sm text-muted-foreground">
            {log.one_line_review}
          </p>
        )}
      </div>
    </Link>
  );
}
