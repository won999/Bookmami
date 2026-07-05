import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export async function NavBar() {
  const session = await getSession();
  if (!session) return null;

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold tracking-tight">
          📖 책방아줌마
        </Link>
        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/logs/new">기록하기</Link>}
          />
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/family">가족 관리</Link>}
          />
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              로그아웃
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
