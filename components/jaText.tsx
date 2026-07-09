import type { ReactNode } from "react";

/**
 * 일본어 문구를 구두점(、。・！？」) 뒤에서 쪼개 inline-block으로 감싸,
 * 모바일에서 단어 중간이 아닌 구두점 위치에서 줄바꿈되도록 하는 헬퍼.
 * max보다 긴 구는 감싸지 않고 그대로 두어 가로 오버플로우를 방지.
 */
export function jaPhrases(text: string, max = 11): ReactNode {
  return text.split(/(?<=[、。・！？」])/).map((part, i) =>
    part.length <= max ? (
      <span key={i} className="inline-block">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
