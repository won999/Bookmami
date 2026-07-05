import { listFamilyMembers } from "@/lib/data";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddMemberForm } from "./add-member-form";
import { TemplatePicker } from "./template-picker";

export default async function FamilyPage() {
  const [members, session] = await Promise.all([listFamilyMembers(), getSession()]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-xl font-bold">가족 관리</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        우리 가족 계정을 추가하고, 인스타 카드 기본 스타일을 정해요.
      </p>

      <div className="mb-8 flex flex-col gap-3">
        {members.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.avatar_emoji}</span>
                <span className="font-medium">{m.name}</span>
              </div>
              {session?.memberId === m.id && (
                <TemplatePicker current={m.default_template} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">새 가족 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMemberForm />
        </CardContent>
      </Card>
    </div>
  );
}
