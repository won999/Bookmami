"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { uploadReadingPhoto } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import type { ReadingFormat, ReadingStatus } from "@/lib/types";

export type LogActionState = { error?: string } | undefined;

function readCommon(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || null;
  const publisher = String(formData.get("publisher") ?? "").trim() || null;
  const genre = String(formData.get("genre") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "want") as ReadingStatus;
  const format = String(formData.get("format") ?? "paper") as ReadingFormat;
  const rating = Number(formData.get("rating") ?? 0);
  const startedAt = String(formData.get("startedAt") ?? "") || null;
  const finishedAt = String(formData.get("finishedAt") ?? "") || null;
  const oneLineReview = String(formData.get("oneLineReview") ?? "").trim() || null;
  const quote = String(formData.get("quote") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const recommendRaw = formData.get("recommend");
  const recommend =
    recommendRaw === "true" ? true : recommendRaw === "false" ? false : null;

  return {
    title,
    author,
    publisher,
    genre,
    status,
    format,
    rating,
    startedAt,
    finishedAt,
    oneLineReview,
    quote,
    tags,
    recommend,
  };
}

export async function createLogAction(
  _prevState: LogActionState,
  formData: FormData
): Promise<LogActionState> {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요해요." };

  const fields = readCommon(formData);
  if (!fields.title) return { error: "책 제목을 입력해주세요." };

  let coverUrl: string | null = null;
  let photoUrl: string | null = null;

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    coverUrl = await uploadReadingPhoto(cover, "covers");
  }
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await uploadReadingPhoto(photo, "photos");
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("reading_logs")
    .insert({
      member_id: session.memberId,
      title: fields.title,
      author: fields.author,
      publisher: fields.publisher,
      genre: fields.genre,
      status: fields.status,
      format: fields.format,
      rating: fields.rating,
      started_at: fields.startedAt,
      finished_at: fields.finishedAt,
      one_line_review: fields.oneLineReview,
      quote: fields.quote,
      tags: fields.tags,
      recommend: fields.recommend,
      cover_url: coverUrl,
      photo_url: photoUrl,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "저장하지 못했어요. 다시 시도해주세요." };
  }

  revalidatePath("/");
  redirect(`/logs/${data.id}`);
}

export async function updateLogAction(
  logId: string,
  _prevState: LogActionState,
  formData: FormData
): Promise<LogActionState> {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요해요." };

  const admin = getSupabaseAdmin();
  const { data: existing } = await admin
    .from("reading_logs")
    .select("member_id, cover_url, photo_url")
    .eq("id", logId)
    .maybeSingle();

  if (!existing || existing.member_id !== session.memberId) {
    return { error: "수정 권한이 없어요." };
  }

  const fields = readCommon(formData);
  if (!fields.title) return { error: "책 제목을 입력해주세요." };

  let coverUrl = existing.cover_url as string | null;
  let photoUrl = existing.photo_url as string | null;

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    coverUrl = await uploadReadingPhoto(cover, "covers");
  }
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await uploadReadingPhoto(photo, "photos");
  }

  const { error } = await admin
    .from("reading_logs")
    .update({
      title: fields.title,
      author: fields.author,
      publisher: fields.publisher,
      genre: fields.genre,
      status: fields.status,
      format: fields.format,
      rating: fields.rating,
      started_at: fields.startedAt,
      finished_at: fields.finishedAt,
      one_line_review: fields.oneLineReview,
      quote: fields.quote,
      tags: fields.tags,
      recommend: fields.recommend,
      cover_url: coverUrl,
      photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", logId);

  if (error) return { error: "수정하지 못했어요. 다시 시도해주세요." };

  revalidatePath("/");
  revalidatePath(`/logs/${logId}`);
  redirect(`/logs/${logId}`);
}

export async function deleteLogAction(logId: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  const admin = getSupabaseAdmin();
  await admin
    .from("reading_logs")
    .delete()
    .eq("id", logId)
    .eq("member_id", session.memberId);

  revalidatePath("/");
  redirect("/");
}
