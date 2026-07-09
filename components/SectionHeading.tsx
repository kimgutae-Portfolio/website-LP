// 각 섹션 공통 헤딩 (라벨 + 타이틀)
export function SectionHeading({
  label,
  title,
  id,
}: {
  label: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-10 text-center sm:mb-14" id={id}>
      <p className="mb-3 inline-block rounded-full bg-primary-light px-4 py-1 text-sm font-bold tracking-wide text-primary">
        {label}
      </p>
      <h2 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
