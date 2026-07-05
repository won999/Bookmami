import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getReadingLogById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteLogButton } from "./delete-button";
import { FORMAT_LABEL, STATUS_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [log, session] = await Promise.all([getReadingLogById(id), getSession()]);

  if (!log) notFound();

  const isOwner = session?.memberId === log.member_id;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <span>{log.family_members.avatar_emoji}</span>
        <span>{log.family_members.name}</span>
        <Badge variant="secondary">{STATUS_LABEL[log.status]}</Badge>
        <Badge variant="outline">{FORMAT_LABEL[log.format]}</Badge>
      </div>

      {log.cover_url && (
        <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted">
          <Image src={log.cover_url} alt={log.title} fill className="object-cover" />
        </div>
      )}

      <h1 className="text-2xl font-bold">{log.title}</h1>
      {(log.author || log.publisher) && (
        <p className="mt-1 text-sm text-muted-foreground">
          {[log.author, log.publisher].filter(Boolean).join(" · ")}
        </p>
      )}

      <div className="mt-2 flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              "h-5 w-5",
              n <= log.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            )}
          />
        ))}
      </div>

      {log.one_line_review && (
        <p className="mt-4 text-lg font-medium">&ldquo;{log.one_line_review}&rdquo;</p>
      )}

      {log.quote && (
        <blockquote className="mt-4 border-l-2 pl-3 text-sm text-muted-foreground">
          {log.quote}
        </blockquote>
      )}

      {log.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {log.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {log.recommend !== null && (
        <p className="mt-4 text-sm">
          {log.recommend ? "👍 가족에게 추천해요" : "👎 가족에게 추천하지 않아요"}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          nativeButton={false}
          render={<Link href={`/logs/${log.id}/card`}>인스타용 카드 만들기</Link>}
        />
        {isOwner && (
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/logs/${log.id}/edit`}>수정</Link>}
            />
            <DeleteLogButton logId={log.id} />
          </>
        )}
      </div>
    </div>
  );
}
