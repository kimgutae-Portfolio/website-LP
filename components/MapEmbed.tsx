/**
 * Google 지도 임베드 (API 키 불필요한 output=embed 방식)
 * 고객 사이트 템플릿에서도 그대로 재사용하는 전제의 공용 컴포넌트.
 * query에 주소·점포명을 넣으면 해당 위치가 표시된다.
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
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
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
