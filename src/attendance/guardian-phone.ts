/**
 * 보호자 전화번호 정규화.
 *
 * 입력에서 숫자만 추출한 뒤 국내 전화번호 패턴(휴대 01x, 서울 02, 그 외 지역 03x~06x)으로
 * 매칭하여 하이픈 포함 정규형으로 반환한다. 매칭 실패 시 null.
 *
 * - 휴대(01x): 10~11자리 → `01X-XXXX-XXXX` (가운데 3~4자리)
 * - 서울(02):  9~10자리 → `02-XXX-XXXX` 또는 `02-XXXX-XXXX`
 * - 지역(0XX, XX∈[31..64]): 10~11자리 → `0XX-XXX-XXXX` 또는 `0XX-XXXX-XXXX`
 */
export function normalizeKoreanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 11) return null;

  // 휴대 01x
  if (/^01[0-9]/.test(digits)) {
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return null;
  }

  // 서울 02
  if (digits.startsWith("02")) {
    if (digits.length === 9) return `02-${digits.slice(2, 5)}-${digits.slice(5)}`;
    if (digits.length === 10) return `02-${digits.slice(2, 6)}-${digits.slice(6)}`;
    return null;
  }

  // 지역 0XX (031~064)
  if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])/.test(digits)) {
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return null;
  }

  return null;
}
