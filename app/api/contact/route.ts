import { NextResponse } from "next/server";

/**
 * 문의 폼 전송 엔드포인트 (현재는 stub)
 *
 * TODO(확장 예정):
 *  - Resend로 메일 전송 (RESEND_API_KEY 환경변수)
 *  - Supabase에 문의 내역 저장
 *  - LINE 알림 연동
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";

  if (!name || !contact) {
    return NextResponse.json(
      { ok: false, error: "name and contact are required" },
      { status: 400 },
    );
  }

  // stub: 우선 서버 로그로만 기록
  console.log("[contact] お問い合わせ:", {
    name,
    company: body.company ?? "",
    contact,
    message: body.message ?? "",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
