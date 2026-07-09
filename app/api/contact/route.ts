import { NextResponse } from "next/server";

/**
 * 문의 폼 전송 엔드포인트 — Resend로 메일 전송
 *
 * 필요 환경변수:
 *  - RESEND_API_KEY   : Resend API 키
 *  - CONTACT_TO_EMAIL : 문의를 받을 주소
 *  - CONTACT_FROM_EMAIL(선택) : 발신자 표기. 도메인 인증 전에는 onboarding@resend.dev 사용
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
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !contact) {
    return NextResponse.json(
      { ok: false, error: "name and contact are required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL が未設定");
    return NextResponse.json({ ok: false, error: "server not configured" }, { status: 500 });
  }

  const text = [
    "ホームページのお問い合わせフォームから新しいご相談が届きました。",
    "",
    `■ お名前: ${name}`,
    `■ 店舗名・屋号: ${company || "（未記入）"}`,
    `■ ご連絡先: ${contact}`,
    "■ ご相談内容:",
    message || "（未記入）",
    "",
    `受信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
  ].join("\n");

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
      to: [to],
      subject: `【お問い合わせ】${name}様${company ? `（${company}）` : ""}より`,
      text,
      ...(isEmail ? { reply_to: contact } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact] Resend送信失敗:", res.status, detail);
    return NextResponse.json({ ok: false, error: "mail send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
