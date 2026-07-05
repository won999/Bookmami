export type ReadingStatus = "want" | "reading" | "done";
export type ReadingFormat = "paper" | "ebook" | "audio";
export type CardTemplate = "cover-rating" | "minimal-quote" | "polaroid-photo";

export const STATUS_LABEL: Record<ReadingStatus, string> = {
  want: "읽고 싶어요",
  reading: "읽는 중",
  done: "완독",
};

export const FORMAT_LABEL: Record<ReadingFormat, string> = {
  paper: "종이책",
  ebook: "전자책",
  audio: "오디오북",
};

export const TEMPLATE_LABEL: Record<CardTemplate, string> = {
  "cover-rating": "표지 + 별점",
  "minimal-quote": "미니멀 문구",
  "polaroid-photo": "폴라로이드 사진",
};

export const GENRES = [
  "소설",
  "에세이",
  "시",
  "인문",
  "역사",
  "과학",
  "자기계발",
  "경제/경영",
  "육아",
  "그림책/동화",
  "만화",
  "기타",
];

export type FamilyMember = {
  id: string;
  name: string;
  avatar_emoji: string;
  default_template: CardTemplate;
  created_at: string;
};

export type ReadingLog = {
  id: string;
  member_id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  genre: string | null;
  cover_url: string | null;
  photo_url: string | null;
  status: ReadingStatus;
  rating: number;
  format: ReadingFormat;
  started_at: string | null;
  finished_at: string | null;
  one_line_review: string | null;
  quote: string | null;
  tags: string[];
  recommend: boolean | null;
  created_at: string;
  updated_at: string;
};

export type ReadingLogWithMember = ReadingLog & {
  family_members: Pick<FamilyMember, "id" | "name" | "avatar_emoji">;
};
