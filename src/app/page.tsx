import { Suspense } from "react";
import Link from "next/link";
import { listFamilyMembers, listReadingLogs } from "@/lib/data";
import { ReadingLogCard } from "@/components/reading-log-card";
import { FeedFilters } from "@/app/feed-filters";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string; status?: string }>;
}) {
  const { member, status } = await searchParams;
  const [members, logs] = await Promise.all([
    listFamilyMembers(),
    listReadingLogs({ memberId: member, status }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Suspense>
          <FeedFilters members={members} />
        </Suspense>
        <Button size="sm" render={<Link href="/logs/new">+ 기록하기</Link>} />
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <p className="mb-2 text-3xl">📖</p>
          <p>아직 기록이 없어요.</p>
          <p className="text-sm">첫 독서 기록을 남겨보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <ReadingLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
