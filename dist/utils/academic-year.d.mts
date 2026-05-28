/**
 * 한국 학년도(3월~익년 2월) 기준, 날짜가 속한 학년도(시작 연도)를 반환한다.
 * 예: 2026-09-15 → 2026, 2027-02-28 → 2026.
 *
 * UTC 기준으로 월을 판단한다(테스트 일관성·CI 타임존 독립). Prisma `DATE`
 * 컬럼은 UTC 자정으로 마샬되므로 ClassJournal.date 등은 그대로 안전.
 * 다만 KST 자정 직후 ~9시간 윈도우의 `new Date()` 호출은 학년도 경계에서
 * 오분류 위험 — 한국 시각을 의미하는 시각이라면 호출부에서 명시적인 정오
 * 등 안전한 시각을 부여하거나, 날짜 부분만 UTC ISO로 변환해 전달할 것.
 */
declare function getAcademicYearForDate(date: Date): number;
declare function getCurrentAcademicYear(now?: Date): number;

export { getAcademicYearForDate, getCurrentAcademicYear };
