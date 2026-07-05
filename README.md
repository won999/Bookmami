# 책방아줌마 · Bookmami

우리 가족만을 위한 독서 기록 웹앱입니다. 사진, 별점, 한줄평 등을 간단한 버튼/풀다운으로 기록하고, 인스타그램에 올릴 수 있는 카드 이미지를 만들어줍니다.

## 스택

- Next.js 16 (App Router) + Tailwind CSS + shadcn/ui
- Supabase (Postgres + Storage) — 서버 액션에서 service role 키로만 접근
- 가족 전용 초간단 로그인 (이름 선택 + 비밀번호, bcrypt 해시)
- 인스타그램 카드 생성: `next/og`(satori) 기반, 3가지 템플릿

## 로컬 개발 준비

1. 의존성 설치

   ```bash
   npm install
   ```

2. Supabase 프로젝트를 만들고 SQL Editor에서 `supabase/migrations/0001_init.sql`을 실행합니다.
   (또는 Supabase CLI가 있다면 `supabase db push`)

3. `.env.local.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.

   ```bash
   cp .env.local.example .env.local
   ```

   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase 프로젝트 설정 → API
   - `SESSION_SECRET`: `openssl rand -base64 32`로 생성

4. 개발 서버 실행

   ```bash
   npm run dev
   ```

5. 처음 접속하면 `/setup`으로 이동해 첫 가족 계정을 만듭니다. 이후 로그인 상태에서 "가족 관리" 메뉴로 나머지 가족을 추가할 수 있습니다.

## 인스타그램 공유 방식

계정 연동이나 API 게시 없이, 기록을 1080x1080 카드 이미지로 만들어 다운로드하거나 OS 공유 시트로 인스타그램 앱에 바로 전달합니다. 각 가족 구성원은 "가족 관리" 페이지에서 자신의 기본 카드 스타일을 저장할 수 있고, 카드 생성 화면에서 그때그때 다른 스타일을 골라 자신의 계정에 올릴 수 있습니다.

## 배포

GitHub 저장소를 Vercel 프로젝트와 연결하고, 위 3개의 환경 변수를 Vercel 프로젝트 설정 → Environment Variables에 등록하면 됩니다.
