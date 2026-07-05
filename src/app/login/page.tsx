import { redirect } from "next/navigation";
import { listFamilyMembers } from "@/lib/data";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const members = await listFamilyMembers();
  if (members.length === 0) {
    redirect("/setup");
  }

  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 px-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">책방아줌마</p>
        <h1 className="text-2xl font-bold tracking-tight">Bookmami</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          우리 가족 독서 기록장에 오신 걸 환영해요
        </p>
      </div>
      <LoginForm members={members} next={next ?? "/"} />
    </div>
  );
}
