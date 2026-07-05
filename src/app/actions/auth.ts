"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionCookie, destroySessionCookie } from "@/lib/session";
import { getFamilyMemberByName, listFamilyMembers } from "@/lib/data";

export type ActionState = { error?: string } | undefined;

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const memberId = String(formData.get("memberId") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!memberId || !password) {
    return { error: "가족을 선택하고 비밀번호를 입력해주세요." };
  }

  const admin = getSupabaseAdmin();
  const { data: member, error } = await admin
    .from("family_members")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (error || !member) {
    return { error: "가족 정보를 찾을 수 없어요." };
  }

  const valid = await verifyPassword(password, member.password_hash);
  if (!valid) {
    return { error: "비밀번호가 맞지 않아요." };
  }

  await createSessionCookie({ memberId: member.id, name: member.name });
  redirect(next || "/");
}

export async function logoutAction() {
  await destroySessionCookie();
  redirect("/login");
}

export async function createFirstMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const existing = await listFamilyMembers();
  if (existing.length > 0) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const avatarEmoji = String(formData.get("avatarEmoji") ?? "📚");

  if (!name || password.length < 4) {
    return { error: "이름을 입력하고 비밀번호는 4자 이상으로 만들어주세요." };
  }

  const admin = getSupabaseAdmin();
  const password_hash = await hashPassword(password);
  const { data: member, error } = await admin
    .from("family_members")
    .insert({ name, password_hash, avatar_emoji: avatarEmoji })
    .select("id, name")
    .single();

  if (error || !member) {
    return { error: "계정을 만들지 못했어요. 다시 시도해주세요." };
  }

  await createSessionCookie({ memberId: member.id, name: member.name });
  redirect("/");
}

export async function addFamilyMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const avatarEmoji = String(formData.get("avatarEmoji") ?? "📚");

  if (!name || password.length < 4) {
    return { error: "이름을 입력하고 비밀번호는 4자 이상으로 만들어주세요." };
  }

  const existing = await getFamilyMemberByName(name);
  if (existing) {
    return { error: "이미 같은 이름의 가족이 있어요." };
  }

  const admin = getSupabaseAdmin();
  const password_hash = await hashPassword(password);
  const { error } = await admin
    .from("family_members")
    .insert({ name, password_hash, avatar_emoji: avatarEmoji });

  if (error) {
    return { error: "계정을 만들지 못했어요. 다시 시도해주세요." };
  }

  redirect("/family");
}
