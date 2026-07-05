import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let cachedAdmin: ReturnType<typeof createClient<Database>> | null = null;

/** Service-role client. Server-only — never import this from a Client Component. */
export function getSupabaseAdmin() {
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  cachedAdmin = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return cachedAdmin;
}

const READING_PHOTOS_BUCKET = "reading-photos";

export function publicStorageUrl(path: string) {
  const url = process.env.SUPABASE_URL;
  return `${url}/storage/v1/object/public/${READING_PHOTOS_BUCKET}/${path}`;
}

export async function uploadReadingPhoto(file: File, folder: string) {
  const admin = getSupabaseAdmin();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await admin.storage
    .from(READING_PHOTOS_BUCKET)
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw error;
  return publicStorageUrl(path);
}
