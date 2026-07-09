"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl bg-primary-light p-6 text-center">
        <p className="font-bold text-primary">送信しました。</p>
        <p className="mt-1 text-sm text-slate-600">
          内容を確認のうえ、2営業日以内にご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-slate-700">
          お名前 <span className="text-accent">必須</span>
        </label>
        <input id="name" name="name" required autoComplete="name" placeholder="堺 太郎" className={inputClass} />
      </div>
      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-bold text-slate-700">
          店舗名・屋号
        </label>
        <input id="company" name="company" autoComplete="organization" placeholder="○○食堂" className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-input" className="mb-1.5 block text-sm font-bold text-slate-700">
          ご連絡先（メールまたは電話番号） <span className="text-accent">必須</span>
        </label>
        <input id="contact-input" name="contact" required placeholder="example@email.com / 090-0000-0000" className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-slate-700">
          ご相談内容
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="例）お店のホームページを新しく作りたい"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-md transition hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "sending" ? "送信中…" : "相談内容を送信する"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm font-bold text-red-600">
          送信に失敗しました。お手数ですが、LINEからご連絡ください。
        </p>
      )}
    </form>
  );
}
