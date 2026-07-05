import "server-only";
import { readFile } from "fs/promises";
import { join } from "path";

let cachedFonts: { name: string; data: Buffer; weight: 400 | 800; style: "normal" }[] | null =
  null;

export async function loadCardFonts() {
  if (cachedFonts) return cachedFonts;

  const dir = join(process.cwd(), "assets", "fonts");
  const [regular, extraBold] = await Promise.all([
    readFile(join(dir, "Pretendard-Regular.ttf")),
    readFile(join(dir, "Pretendard-ExtraBold.ttf")),
  ]);

  cachedFonts = [
    { name: "Pretendard", data: regular, weight: 400, style: "normal" },
    { name: "Pretendard", data: extraBold, weight: 800, style: "normal" },
  ];
  return cachedFonts;
}
