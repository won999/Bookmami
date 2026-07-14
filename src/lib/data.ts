import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  FamilyMember,
  ReadingLogWithMember,
  ReadingLog,
  ReadingStatus,
} from "@/lib/types";

export async function listFamilyMembers(): Promise<FamilyMember[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("family_members")
    .select(
      "id, name, avatar_emoji, default_template, reading_personality, reading_personality_updated_at, created_at"
    )
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as unknown as FamilyMember[];
}

export async function getFamilyMemberByName(name: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("family_members")
    .select("*")
    .eq("name", name)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFamilyMemberById(id: string): Promise<FamilyMember | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("family_members")
    .select(
      "id, name, avatar_emoji, default_template, reading_personality, reading_personality_updated_at, created_at"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as FamilyMember | null;
}

export async function listReadingLogs(filters?: {
  memberId?: string;
  status?: string;
}): Promise<ReadingLogWithMember[]> {
  const admin = getSupabaseAdmin();
  let query = admin
    .from("reading_logs")
    .select("*, family_members(id, name, avatar_emoji)")
    .order("created_at", { ascending: false });

  if (filters?.memberId) query = query.eq("member_id", filters.memberId);
  if (filters?.status)
    query = query.eq("status", filters.status as ReadingStatus);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as ReadingLogWithMember[];
}

export async function getReadingLogById(id: string): Promise<ReadingLogWithMember | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("reading_logs")
    .select("*, family_members(id, name, avatar_emoji)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ReadingLogWithMember | null;
}

export async function countReadingLogsByMember(memberId: string): Promise<number> {
  const admin = getSupabaseAdmin();
  const { count, error } = await admin
    .from("reading_logs")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId);
  if (error) throw error;
  return count ?? 0;
}

export async function getReadingLogRaw(id: string): Promise<ReadingLog | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("reading_logs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ReadingLog | null;
}
