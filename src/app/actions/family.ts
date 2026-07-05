"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import type { CardTemplate } from "@/lib/types";

export async function updateDefaultTemplateAction(template: CardTemplate) {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요해요." };

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("family_members")
    .update({ default_template: template })
    .eq("id", session.memberId);

  if (error) return { error: "저장하지 못했어요." };

  revalidatePath("/family");
  return { ok: true };
}
