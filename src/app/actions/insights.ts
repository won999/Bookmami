"use server";

import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { MIN_LOGS_FOR_INSIGHT } from "@/lib/types";

export async function analyzeReadingPersonalityAction(memberId: string) {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요해요." };

  const admin = getSupabaseAdmin();
  const [{ data: member }, { data: logs, error: logsError }] = await Promise.all([
    admin.from("family_members").select("name").eq("id", memberId).maybeSingle(),
    admin
      .from("reading_logs")
      .select("title, genre, rating, tags, one_line_review, quote")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (!member) return { error: "가족을 찾을 수 없어요." };
  if (logsError) return { error: "기록을 불러오지 못했어요." };
  if (!logs || logs.length < MIN_LOGS_FOR_INSIGHT) {
    return { error: `기록이 ${MIN_LOGS_FOR_INSIGHT}개 이상 쌓이면 분석할 수 있어요.` };
  }

  const logSummary = logs
    .map((l) => {
      const parts = [`제목: ${l.title}`];
      if (l.genre) parts.push(`장르: ${l.genre}`);
      if (l.rating) parts.push(`별점: ${l.rating}/5`);
      if (l.tags?.length) parts.push(`태그: ${l.tags.join(", ")}`);
      if (l.one_line_review) parts.push(`한줄평: ${l.one_line_review}`);
      if (l.quote) parts.push(`인상 깊은 구절: ${l.quote}`);
      return `- ${parts.join(" / ")}`;
    })
    .join("\n");

  let text: string;
  try {
    const result = await generateText({
      model: "anthropic/claude-haiku-4.5",
      system:
        "당신은 가족 독서 기록 앱 '책방아줌마'의 다정한 분석가예요. " +
        "가족 구성원의 독서 기록을 보고 선호 장르와 성격을 따뜻하고 짧게(2~4문장) 한국어 존댓말로 묘사해주세요. " +
        "과장하지 말고, 실제 기록에 나온 장르·태그·한줄평·구절을 구체적인 근거로 삼아주세요. 이모지는 쓰지 마세요.",
      prompt: `${member.name}님의 독서 기록입니다:\n${logSummary}\n\n${member.name}님이 선호하는 장르와 그로부터 드러나는 성격을 분석해주세요.`,
    });
    text = result.text.trim();
  } catch {
    return { error: "분석에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  const { error: updateError } = await admin
    .from("family_members")
    .update({
      reading_personality: text,
      reading_personality_updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (updateError) return { error: "저장하지 못했어요." };

  revalidatePath("/family");
  return { ok: true };
}
