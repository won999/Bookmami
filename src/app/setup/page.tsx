import { redirect } from "next/navigation";
import { listFamilyMembers } from "@/lib/data";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  const members = await listFamilyMembers();
  if (members.length > 0) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 px-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">책방아줌마 첫 설정</p>
        <h1 className="text-2xl font-bold tracking-tight">Bookmami 시작하기</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가장 먼저 우리 가족 대표 계정을 만들어주세요.
          <br />
          나머지 가족은 로그인 후 &apos;가족 관리&apos;에서 추가할 수 있어요.
        </p>
      </div>
      <SetupForm />
    </div>
  );
}
