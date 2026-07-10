/**
 * Google 지도 임베드 (API 키 불필요)
 * 고객 사이트 템플릿에서도 그대로 재사용하는 전제의 공용 컴포넌트.
 * query에 주소·점포명을 넣으면 해당 위치가 표시된다.
 *
 * 주의: 구형 `maps.google.com/maps?...&output=embed` URL은 301 리다이렉트
 * 응답에 X-Frame-Options가 붙어 iframe에서 차단된다. 그래서 리다이렉트
 * 최종 목적지인 /maps/embed?pb=... 형식(검색어를 base64로 인코딩)을
 * 직접 생성해서 사용한다.
 */
export function MapEmbed({
  query,
  title = "地図",
  zoom = 14,
  className = "",
}: {
  query: string;
  title?: string;
  zoom?: number;
  className?: string;
}) {
  // pb 파라미터의 !1z 필드는 검색어의 URL-safe base64
  const encoded = Buffer.from(query, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  // !5m2!1sja!2sjp: 열람자의 브라우저 언어와 무관하게 지도 표기를 일본어로 고정
  // (?hl= 파라미터는 pb 형식 embed에서 무시되므로 pb 내부 언어 필드를 사용)
  const src = `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1z${encoded}!6i${zoom}!5m2!1sja!2sjp`;

  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`border-0 ${className}`}
    />
  );
}
