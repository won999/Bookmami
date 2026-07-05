import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getReadingLogById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { loadCardFonts } from "@/lib/og-fonts";
import {
  CARD_SIZE,
  CoverRatingCard,
  MinimalQuoteCard,
  PolaroidPhotoCard,
} from "@/lib/card-templates";
import type { CardTemplate, ReadingLogWithMember } from "@/lib/types";

const RENDERERS: Record<
  CardTemplate,
  (props: { log: ReadingLogWithMember }) => React.ReactElement
> = {
  "cover-rating": CoverRatingCard,
  "minimal-quote": MinimalQuoteCard,
  "polaroid-photo": PolaroidPhotoCard,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; template: string }> }
) {
  const { id, template } = await params;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const log = await getReadingLogById(id);
  if (!log) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const renderer = RENDERERS[template as CardTemplate] ?? CoverRatingCard;
  const fonts = await loadCardFonts();

  return new ImageResponse(renderer({ log }), {
    width: CARD_SIZE,
    height: CARD_SIZE,
    fonts,
  });
}
