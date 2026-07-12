import { APP_VERSION } from "@/lib/version";

export function VersionBadge() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const env = process.env.VERCEL_ENV;
  const label = [`v${APP_VERSION}`, sha, env && env !== "production" ? env : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pointer-events-none fixed top-2 right-2 z-50 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur">
      {label || `v${APP_VERSION} · local`}
    </div>
  );
}
