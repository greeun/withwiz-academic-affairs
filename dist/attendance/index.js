"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkJFJ42V3Wjs = require('../chunk-JFJ42V3W.js');

// src/attendance/format.ts
var SCHOOL_LEVEL_SHORT = {
  ELEMENTARY: "\uCD08",
  MIDDLE: "\uC911",
  HIGH: "\uACE0"
};
var SCHOOL_LEVEL_LONG = {
  ELEMENTARY: "\uCD08\uB4F1\uD559\uAD50",
  MIDDLE: "\uC911\uD559\uAD50",
  HIGH: "\uACE0\uB4F1\uD559\uAD50"
};
function formatSchoolLevel(level) {
  return SCHOOL_LEVEL_SHORT[level];
}

// src/attendance/sanitize.ts
var CONTROL_CHAR_RE = new RegExp("[\\x00-\\x1F\\x7F\\u0085\\u2028\\u2029]", "g");
var HEADER_DELIM_RE = /["';]/g;
function sanitizeFilename(name) {
  let s = _nullishCoalesce(name, () => ( ""));
  s = s.replace(/\\/g, "_");
  s = s.replace(/\//g, "_");
  s = s.replace(/\.\.+/g, "_");
  s = s.replace(HEADER_DELIM_RE, "_");
  s = s.replace(CONTROL_CHAR_RE, "_");
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/^\.+/, "");
  if (s.length === 0) s = "untitled";
  const enc = new TextEncoder();
  let bytes = enc.encode(s);
  if (bytes.length <= 200) return s;
  let truncated = s;
  while (bytes.length > 200 && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    bytes = enc.encode(truncated);
  }
  return truncated || "untitled";
}
function encodeRfc5987(value) {
  return encodeURIComponent(value).replace(/['()]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()).replace(/\*/g, "%2A");
}

// src/attendance/date-rules.ts
function toDateOnlyString(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseDateOnly(s) {
  return /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
}
function todayKstString() {
  const now = /* @__PURE__ */ new Date();
  const kstMs = now.getTime() + 9 * 60 * 60 * 1e3;
  const kst = new Date(kstMs);
  return toDateOnlyString(kst);
}
function classifyDate(date, schedules, schoolLevel) {
  const target = toDateOnlyString(date);
  const dow = date.getUTCDay();
  if (dow === 0 || dow === 6) {
    return { dayType: "weekend", label: "\uC8FC\uB9D0" };
  }
  for (const s of schedules) {
    if (s.scheduleType !== "HOLIDAY" && s.scheduleType !== "VACATION") continue;
    const sLv = _nullishCoalesce(s.schoolLevel, () => ( null));
    if (sLv !== null) {
      if (!schoolLevel || sLv !== schoolLevel) continue;
    }
    const start = toDateOnlyString(s.startDate);
    const end = s.endDate ? toDateOnlyString(s.endDate) : start;
    if (target >= start && target <= end) {
      const prefix = s.scheduleType === "HOLIDAY" ? "\uACF5\uD734\uC77C" : "\uD734\uC5C5\uC77C";
      return { dayType: "holiday", label: `${prefix}(${s.title})` };
    }
  }
  return { dayType: "schoolday", label: "\uC218\uC5C5\uC77C" };
}

// src/attendance/guardian-phone.ts
function normalizeKoreanPhone(input) {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 11) return null;
  if (/^01[0-9]/.test(digits)) {
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return null;
  }
  if (digits.startsWith("02")) {
    if (digits.length === 9) return `02-${digits.slice(2, 5)}-${digits.slice(5)}`;
    if (digits.length === 10) return `02-${digits.slice(2, 6)}-${digits.slice(6)}`;
    return null;
  }
  if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])/.test(digits)) {
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return null;
  }
  return null;
}

// src/attendance/aggregate.ts
var CATEGORIES = ["ABSENT", "LATE", "EARLY_LEAVE", "RESULT"];
var REASONS = ["SICK", "UNAUTH", "OTHER", "AUTHORIZED"];
var CELL_KEYS = CATEGORIES.flatMap(
  (c) => REASONS.map((r) => `${c}_${r}`)
);
function makeEmptyCounts() {
  const out = {};
  for (const k of CELL_KEYS) out[k] = 0;
  return out;
}
function makeEmptyDrafts() {
  const out = {};
  for (const k of CELL_KEYS) out[k] = "";
  return out;
}
function aggregateEntries(entries) {
  const counts = makeEmptyCounts();
  const tokens = {};
  for (const k of CELL_KEYS) tokens[k] = [];
  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  for (const e of sorted) {
    const key = `${e.code.aggregateCategory}_${e.code.aggregateReason}`;
    counts[key] = (_nullishCoalesce(counts[key], () => ( 0))) + 1;
    const m = e.date.getUTCMonth() + 1;
    const d = e.date.getUTCDate();
    const memo = (_nullishCoalesce(e.memo, () => ( ""))).trim();
    const token = memo ? `${m}/${d} ${e.code.displayName}(${memo})` : `${m}/${d} ${e.code.displayName}`;
    tokens[key].push(token);
  }
  const drafts = makeEmptyDrafts();
  for (const k of CELL_KEYS) {
    drafts[k] = tokens[k].join("  ");
  }
  return { counts, drafts };
}
function validateCellKeySet(obj) {
  const keys = Object.keys(obj);
  if (keys.length !== CELL_KEYS.length) {
    return "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D 16\uCE78 \uBAA8\uB450 \uD0A4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.";
  }
  for (const k of CELL_KEYS) {
    if (!(k in obj)) return "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D 16\uCE78 \uBAA8\uB450 \uD0A4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.";
  }
  for (const k of keys) {
    if (!CELL_KEYS.includes(k)) {
      return "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D \uD0A4 \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
    }
  }
  return null;
}
function resolveCellTexts(drafts, override) {
  const out = makeEmptyDrafts();
  for (const k of CELL_KEYS) {
    const ov = _optionalChain([override, 'optionalAccess', _ => _[k]]);
    const trimmed = typeof ov === "string" ? ov.trim() : "";
    out[k] = trimmed.length > 0 ? ov : drafts[k];
  }
  return out;
}

// src/attendance/entry-schemas.ts
var _zod = require('zod');
var dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
var dateOnlyString = _zod.z.string().trim().regex(dateOnlyRegex, "YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.").refine((s) => {
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === m && dt.getUTCDate() === d;
}, "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uB0A0\uC9DC\uC785\uB2C8\uB2E4.");
var LEGACY_ENTRY_KEYS = [
  "academicYear",
  "schoolLevel",
  "yeroomGrade",
  "yeroomClass"
];
var LEGACY_KEY_MESSAGE = "S5: classGroupId only \u2014 4-\uD29C\uD50C \uD0A4(academicYear/schoolLevel/yeroomGrade/yeroomClass)\uB294 \uB354 \uC774\uC0C1 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
function detectLegacyEntryKeys(source) {
  const has = (k) => source instanceof URLSearchParams ? source.has(k) : Object.prototype.hasOwnProperty.call(source, k);
  const found = LEGACY_ENTRY_KEYS.filter(has);
  return found.length ? found : null;
}
var entryListQuerySchema = _zod.z.object({
  date: dateOnlyString,
  classGroupId: _zod.z.string().min(1, "classGroupId\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.")
}).strict();
var entryChangeSchema = _zod.z.object({
  studentId: _zod.z.string().min(1),
  codeId: _zod.z.string().min(1).nullable(),
  memo: _zod.z.string().max(500).nullable().optional().transform((v) => _nullishCoalesce(v, () => ( null)))
});
var entryBulkUpsertSchema = _zod.z.object({
  date: dateOnlyString,
  classGroupId: _zod.z.string().min(1, "classGroupId\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."),
  snapshotAt: _zod.z.iso.datetime({ offset: true }),
  changes: _zod.z.array(entryChangeSchema).min(1, "\uBCC0\uACBD\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")
}).strict();

// src/attendance/student-schemas.ts

var intRange1to99 = _zod.z.number().int().min(1).max(99);
var gradeSchema = _zod.z.number().int().min(1).max(9);
var dateOnlyString2 = _zod.z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.").refine(
  (s) => {
    const d = /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return false;
    const [y, m, day] = s.split("-").map(Number);
    return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
  },
  { message: "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uB0A0\uC9DC\uC785\uB2C8\uB2E4." }
);
var optionalTextField = (max, label) => _zod.z.string().trim().max(max, `${label}\uC740(\uB294) ${max}\uC790 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4.`).nullable().optional().transform((s) => s == null || s === "" ? null : s);
var guardianPhoneSchema = _zod.z.string().trim().nullable().optional().transform((s) => s == null || s === "" ? null : s).refine(
  (s) => s === null || normalizeKoreanPhone(s) !== null,
  "\uC62C\uBC14\uB978 \uC804\uD654\uBC88\uD638 \uD615\uC2DD\uC774 \uC544\uB2D9\uB2C8\uB2E4."
).transform((s) => s === null ? null : normalizeKoreanPhone(s));
var schoolLevelSchema = _zod.z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]);
var ELEMENTARY_GRADES = /* @__PURE__ */ new Set([1, 2, 3, 4, 5, 6]);
var SECONDARY_GRADES = /* @__PURE__ */ new Set([1, 2, 3]);
var studentBaseFields = _zod.z.object({
  // 인물 식별: 기존 Person 연결시 personId, 신규 인물이면 name(+birthdate optional)
  personId: _zod.z.string().min(1).nullable().optional(),
  name: _zod.z.string().trim().min(1, "\uD559\uC0DD\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.").max(50, "\uD559\uC0DD\uBA85\uC740 50\uC790 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4."),
  birthdate: dateOnlyString2.nullable().optional(),
  academicYear: _zod.z.number().int().min(2e3).max(2100),
  classGroupId: _zod.z.string().min(1, "\uBC18(\uADF8\uB8F9)\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694."),
  schoolLevel: schoolLevelSchema,
  grade: gradeSchema,
  // S5-d+: 출석번호는 선택 입력. 미부여 학생은 null.
  yeroomNumber: intRange1to99.nullable(),
  homeSchoolName: _zod.z.string().trim().min(1, "\uC7AC\uC801\uD559\uAD50\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.").max(80, "\uC7AC\uC801\uD559\uAD50\uBA85\uC740 80\uC790 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4."),
  homeSchoolGrade: intRange1to99,
  homeSchoolClass: intRange1to99,
  homeSchoolNumber: intRange1to99,
  consignmentStartDate: dateOnlyString2,
  isActive: _zod.z.boolean().optional(),
  // 보호자 정보 (최대 2명). 모두 선택 입력. 슬롯 안에서 일부만 채울 경우 이름은 필수
  // (validateGuardianSlots 가 검증).
  guardian1Name: optionalTextField(30, "\uBCF4\uD638\uC790 \uC774\uB984"),
  guardian1Phone: guardianPhoneSchema,
  guardian1Relation: optionalTextField(20, "\uBCF4\uD638\uC790 \uAD00\uACC4"),
  guardian2Name: optionalTextField(30, "\uBCF4\uD638\uC790 \uC774\uB984"),
  guardian2Phone: guardianPhoneSchema,
  guardian2Relation: optionalTextField(20, "\uBCF4\uD638\uC790 \uAD00\uACC4")
});
function validateStudentCrossFields(data) {
  const issues = [];
  if (data.schoolLevel !== void 0 && data.grade !== void 0) {
    if (data.schoolLevel === "ELEMENTARY" && !ELEMENTARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "\uCD08\uB4F1\uD559\uAD50\uB294 1~6\uD559\uB144\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."
      });
    } else if (data.schoolLevel === "MIDDLE" && !SECONDARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "\uC911\uD559\uAD50\uB294 1~3\uD559\uB144\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."
      });
    } else if (data.schoolLevel === "HIGH" && !SECONDARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "\uACE0\uB4F1\uD559\uAD50\uB294 1~3\uD559\uB144\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."
      });
    }
  }
  return issues;
}
function applyCrossFieldRefine(data, ctx) {
  const issues = [...validateStudentCrossFields(data), ...validateGuardianSlots(data)];
  for (const i of issues) {
    ctx.addIssue({
      code: "custom",
      path: [...i.path],
      message: i.message
    });
  }
}
var studentCreateSchema = studentBaseFields.superRefine(applyCrossFieldRefine);
var studentUpdateSchema = studentBaseFields.partial();
function validateGuardianSlots(data) {
  const issues = [];
  for (const slot of [1, 2]) {
    const name = data[`guardian${slot}Name`];
    const phone = data[`guardian${slot}Phone`];
    const relation = data[`guardian${slot}Relation`];
    const any = !!(name || phone || relation);
    if (any && !name) {
      issues.push({
        path: [`guardian${slot}Name`],
        message: "\uC5F0\uB77D\uCC98\xB7\uAD00\uACC4\uAC00 \uC785\uB825\uB41C \uACBD\uC6B0 \uBCF4\uD638\uC790 \uC774\uB984\uC740 \uD544\uC218\uC785\uB2C8\uB2E4."
      });
    }
  }
  return issues;
}
function mergeStudentForCrossField(existing, patch) {
  return {
    schoolLevel: _nullishCoalesce(patch.schoolLevel, () => ( existing.schoolLevel)),
    grade: _nullishCoalesce(patch.grade, () => ( existing.grade))
  };
}
function formatDateOnly(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function normalizeName(name) {
  return name.normalize("NFC");
}

// src/attendance/notification-schemas.ts

var dateOnlyRegex2 = /^\d{4}-\d{2}-\d{2}$/;
var notificationListQuerySchema = _zod.z.object({
  year: _zod.z.coerce.number().int().min(2e3).max(2100),
  month: _zod.z.coerce.number().int().min(1).max(12),
  classGroupId: _zod.z.string().min(1, "classGroupId\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.")
});
var notificationBulkZipQuerySchema = _zod.z.object({
  year: _zod.z.coerce.number().int().min(2e3).max(2100),
  month: _zod.z.coerce.number().int().min(1).max(12),
  classGroupId: _zod.z.string().min(1).optional()
});
var overridePutSchema = _zod.z.object({
  categoryTexts: _zod.z.record(_zod.z.string(), _zod.z.unknown()),
  classDaysOverride: _zod.z.number().int().nullable().optional(),
  overrideReason: _zod.z.string().nullable().optional(),
  issueDate: _zod.z.string().nullable().optional().refine(
    (s) => s === null || s === void 0 || dateOnlyRegex2.test(s),
    "\uBC1C\uD589\uC77C\uC740 YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4."
  )
}).superRefine((data, ctx) => {
  const keys = Object.keys(data.categoryTexts);
  if (keys.length !== CELL_KEYS.length) {
    ctx.addIssue({
      code: _zod.z.ZodIssueCode.custom,
      path: ["categoryTexts"],
      message: "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D 16\uCE78 \uBAA8\uB450 \uD0A4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."
    });
    return;
  }
  for (const k of CELL_KEYS) {
    if (!(k in data.categoryTexts)) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["categoryTexts"],
        message: "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D 16\uCE78 \uBAA8\uB450 \uD0A4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."
      });
      return;
    }
  }
  for (const k of keys) {
    if (!CELL_KEYS.includes(k)) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["categoryTexts", k],
        message: "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D \uD0A4 \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
      });
      return;
    }
    const v = data.categoryTexts[k];
    if (typeof v !== "string") {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["categoryTexts", k],
        message: "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D \uC140 \uAC12\uC740 \uBB38\uC790\uC5F4\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
    if (v.length > 500) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["categoryTexts", k],
        message: "\uCD9C\uACB0 \uD2B9\uC774\uC0AC\uD56D \uD55C \uCE78\uC740 500\uC790 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
  }
  const cdo = _nullishCoalesce(data.classDaysOverride, () => ( null));
  if (cdo !== null) {
    if (cdo < 0 || cdo > 31) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["classDaysOverride"],
        message: "\uC218\uC5C5\uC77C\uC218 \uBCF4\uC815\uAC12\uC740 0~31 \uC0AC\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
    const reason = (_nullishCoalesce(data.overrideReason, () => ( ""))).trim();
    if (reason.length === 0) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["overrideReason"],
        message: "\uC218\uC5C5\uC77C\uC218 \uBCF4\uC815 \uC2DC \uC0AC\uC720\uB97C \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
    if (reason.length > 200) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["overrideReason"],
        message: "\uBCF4\uC815 \uC0AC\uC720\uB294 200\uC790 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
  }
  if (data.issueDate) {
    const today = todayKstString();
    const [y, m, d] = today.split("-").map(Number);
    const todayDt = new Date(Date.UTC(y, m - 1, d));
    const [iy, im, id] = data.issueDate.split("-").map(Number);
    const issueDt = new Date(Date.UTC(iy, im - 1, id));
    const diffDays = Math.floor(
      (issueDt.getTime() - todayDt.getTime()) / (24 * 60 * 60 * 1e3)
    );
    if (diffDays > 30) {
      ctx.addIssue({
        code: _zod.z.ZodIssueCode.custom,
        path: ["issueDate"],
        message: "\uBC1C\uD589\uC77C\uC740 \uC624\uB298\uB85C\uBD80\uD130 30\uC77C \uC774\uB0B4\uC5EC\uC57C \uD569\uB2C8\uB2E4."
      });
      return;
    }
  }
});

// src/attendance/class-day-plan.ts

var DAY_TYPES = [
  "CLASS",
  "HOLIDAY",
  "DISCRETIONARY_HOLIDAY",
  "OTHER_HOLIDAY",
  "EXAM",
  "FIELD_TRIP",
  "EVENT",
  "VACATION"
];
var DAY_TYPE_LABELS = {
  CLASS: "\uC218\uC5C5\uC77C",
  HOLIDAY: "\uACF5\uD734\uC77C",
  DISCRETIONARY_HOLIDAY: "\uC7AC\uB7C9\uD734\uC77C",
  OTHER_HOLIDAY: "\uAE30\uD0C0\uD734\uC77C",
  EXAM: "\uACE0\uC0AC\uC77C",
  FIELD_TRIP: "\uCCB4\uD5D8\uD559\uC2B5",
  EVENT: "\uD589\uC0AC",
  VACATION: "\uBC29\uD559/\uD734\uC5C5"
};
var DAY_TYPE_SYMBOLS = {
  CLASS: "",
  HOLIDAY: "",
  DISCRETIONARY_HOLIDAY: "",
  OTHER_HOLIDAY: "",
  EXAM: "\u25A0",
  FIELD_TRIP: "\u25B2",
  EVENT: "\u25CF",
  VACATION: ""
};
var DAY_TYPE_COLORS = {
  CLASS: { text: "#000000", bg: "transparent" },
  HOLIDAY: { text: "#DC2626", bg: "#FEE2E2" },
  DISCRETIONARY_HOLIDAY: { text: "#DC2626", bg: "#FEF2F2" },
  OTHER_HOLIDAY: { text: "#DC2626", bg: "#FEF9C3" },
  EXAM: { text: "#D97706", bg: "#FEF3C7" },
  FIELD_TRIP: { text: "#4F46E5", bg: "#E0E7FF" },
  EVENT: { text: "#2563EB", bg: "#DBEAFE" },
  VACATION: { text: "#059669", bg: "#D1FAE5" }
};
var HOLIDAY_DAY_TYPES = [
  "HOLIDAY",
  "DISCRETIONARY_HOLIDAY",
  "OTHER_HOLIDAY"
];
var CLASS_DAY_TYPES = [
  "CLASS",
  "EXAM",
  "FIELD_TRIP",
  "EVENT"
];
var classDayPlanCreateSchema = _zod.z.object({
  academicYear: _zod.z.number().int().min(2020).max(2100),
  semester: _zod.z.enum(["FIRST", "SECOND"])
});
var classDayEntryUpdateSchema = _zod.z.object({
  entries: _zod.z.array(
    _zod.z.object({
      id: _zod.z.string(),
      dayType: _zod.z.enum(DAY_TYPES).optional(),
      hours: _zod.z.number().int().min(0).max(20).optional(),
      note: _zod.z.string().optional()
    })
  )
});
function groupEntriesByWeek(entries, _semesterStart) {
  if (entries.length === 0) return [];
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const rawWeeks = [];
  let lastMondayKey = "";
  for (const entry of sorted) {
    const d = new Date(entry.date);
    const dow = d.getDay();
    const dayIndex = dow - 1;
    const monday = new Date(d);
    monday.setDate(monday.getDate() - dayIndex);
    const mondayKey = monday.toISOString().slice(0, 10);
    if (mondayKey !== lastMondayKey) {
      rawWeeks.push({ mondayKey, days: [null, null, null, null, null] });
      lastMondayKey = mondayKey;
    }
    const week = rawWeeks[rawWeeks.length - 1];
    if (dayIndex >= 0 && dayIndex < 5) {
      week.days[dayIndex] = entry;
    }
  }
  const result = [];
  let weekNum = 0;
  for (const raw of rawWeeks) {
    const months = /* @__PURE__ */ new Set();
    for (const day of raw.days) {
      if (day) months.add(new Date(day.date).getMonth());
    }
    weekNum++;
    if (months.size <= 1) {
      result.push({
        weekNum,
        month: getWeekMonth(raw.days),
        days: raw.days
      });
    } else {
      const sortedMonths = Array.from(months).sort((a, b) => a - b);
      for (const m of sortedMonths) {
        const splitDays = raw.days.map(
          (day) => day && new Date(day.date).getMonth() === m ? day : null
        );
        if (splitDays.some((d) => d !== null)) {
          result.push({ weekNum, month: m + 1, days: splitDays });
        }
      }
    }
  }
  return result;
}
function getWeekMonth(days) {
  for (const d of days) {
    if (d) return new Date(d.date).getMonth() + 1;
  }
  return 0;
}
function calculateMonthSummaries(weeks) {
  const monthMap = /* @__PURE__ */ new Map();
  for (const week of weeks) {
    for (const day of week.days) {
      if (!day) continue;
      const month2 = new Date(day.date).getMonth() + 1;
      if (!monthMap.has(month2)) {
        monthMap.set(month2, {
          month: month2,
          classDays: 0,
          totalHours: 0,
          holidays: 0,
          weeks: []
        });
      }
      const summary = monthMap.get(month2);
      if (CLASS_DAY_TYPES.includes(day.dayType) && day.hours > 0) {
        summary.classDays++;
      }
      if (HOLIDAY_DAY_TYPES.includes(day.dayType)) {
        summary.holidays++;
      }
      summary.totalHours += day.hours;
    }
    const month = week.month;
    if (!monthMap.has(month) && month > 0) {
      monthMap.set(month, { month, classDays: 0, totalHours: 0, holidays: 0, weeks: [] });
    }
    if (monthMap.has(month)) {
      monthMap.get(month).weeks.push(week);
    }
  }
  return Array.from(monthMap.values()).sort((a, b) => a.month - b.month);
}
function calculateWeekSummary(days) {
  let hours = 0;
  let classDays = 0;
  let holidays = 0;
  for (const day of days) {
    if (!day) continue;
    hours += day.hours;
    if (CLASS_DAY_TYPES.includes(day.dayType) && day.hours > 0) classDays++;
    if (HOLIDAY_DAY_TYPES.includes(day.dayType)) holidays++;
  }
  return { hours, classDays, holidays };
}

// src/attendance/access.ts
async function resolveAccessibleGroups(prisma, userId) {
  const [user, eff] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        staff: { select: { id: true } }
      }
    }),
    _chunkJFJ42V3Wjs.permissionsOf.call(void 0, prisma, userId)
  ]);
  if (!user || !eff) return { kind: "restricted", groupIds: [], groups: [] };
  if (eff.isSystem || eff.hasMenuKey("school.viewAll")) return { kind: "all" };
  const staffId = _optionalChain([user, 'access', _2 => _2.staff, 'optionalAccess', _3 => _3.id]);
  if (!staffId) return { kind: "restricted", groupIds: [], groups: [] };
  const rows = await prisma.classGroup.findMany({
    where: {
      isActive: true,
      OR: [
        { homeroomStaffId: staffId },
        { assistantHomeroomStaffId: staffId }
      ]
    },
    select: {
      id: true,
      academicYear: true,
      name: true,
      sortOrder: true
    },
    orderBy: [
      { academicYear: "desc" },
      { sortOrder: "asc" },
      { name: "asc" }
    ]
  });
  return {
    kind: "restricted",
    groupIds: rows.map((r) => r.id),
    groups: rows
  };
}
function isAccessibleGroupId(access, groupId) {
  if (access.kind === "all") return true;
  return access.groupIds.includes(groupId);
}

// src/attendance/class-days.ts
function computeClassDaysAuto(calendarYear, calendarMonth, schedules) {
  const daysInMonth = new Date(Date.UTC(calendarYear, calendarMonth, 0)).getUTCDate();
  let weekdays = 0;
  let holidays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(calendarYear, calendarMonth - 1, d));
    const dow = date.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    weekdays++;
    const ds = toDateOnlyString(date);
    let isHoliday = false;
    for (const s of schedules) {
      if (s.scheduleType !== "HOLIDAY" && s.scheduleType !== "VACATION") continue;
      const start = toDateOnlyString(s.startDate);
      const end = s.endDate ? toDateOnlyString(s.endDate) : start;
      if (ds >= start && ds <= end) {
        isHoliday = true;
        break;
      }
    }
    if (isHoliday) holidays++;
  }
  return { weekdays, holidays, auto: weekdays - holidays };
}
function resolveClassDaysEffective(input) {
  if (input.override !== null && input.override !== void 0) {
    return { value: input.override, overridden: true };
  }
  return { value: input.auto, overridden: false };
}
function academicYearToCalendarYear(academicYear, month) {
  return month >= 3 ? academicYear : academicYear + 1;
}

// src/attendance/current-staff.ts
async function getCurrentStaffId(prisma, userId) {
  const staff = await prisma.staff.findFirst({
    where: { userId },
    select: { id: true }
  });
  return _nullishCoalesce(_optionalChain([staff, 'optionalAccess', _4 => _4.id]), () => ( null));
}

// src/attendance/notification-data.ts
function monthBounds(academicYear, month) {
  const calendarYear = academicYearToCalendarYear(academicYear, month);
  const calendarMonth = month;
  const lastDay = new Date(
    Date.UTC(calendarYear, calendarMonth, 0)
  ).getUTCDate();
  const first = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-01`;
  const last = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return {
    first,
    last,
    firstDate: /* @__PURE__ */ new Date(`${first}T00:00:00Z`),
    lastDate: /* @__PURE__ */ new Date(`${last}T00:00:00Z`),
    calendarYear,
    calendarMonth
  };
}
async function loadMonthSchedules(prisma, range) {
  const rows = await prisma.academicSchedule.findMany({
    where: {
      scheduleType: { in: ["HOLIDAY", "VACATION"] },
      startDate: { lte: range.lastDate },
      OR: [
        { endDate: null, startDate: { gte: range.firstDate } },
        { endDate: { gte: range.firstDate } }
      ]
    },
    select: { scheduleType: true, startDate: true, endDate: true }
  });
  return rows;
}
async function loadEntriesForStudents(prisma, studentIds, range) {
  if (studentIds.length === 0) return /* @__PURE__ */ new Map();
  const rows = await prisma.attendanceEntry.findMany({
    where: {
      studentId: { in: studentIds },
      date: { gte: range.firstDate, lte: range.lastDate }
    },
    select: {
      studentId: true,
      date: true,
      memo: true,
      code: {
        select: {
          aggregateCategory: true,
          aggregateReason: true,
          displayName: true
        }
      }
    }
  });
  const map = /* @__PURE__ */ new Map();
  for (const id of studentIds) map.set(id, []);
  for (const r of rows) {
    const list = map.get(r.studentId);
    if (!list) continue;
    list.push({
      date: r.date,
      memo: r.memo,
      code: {
        aggregateCategory: r.code.aggregateCategory,
        aggregateReason: r.code.aggregateReason,
        displayName: r.code.displayName
      }
    });
  }
  return map;
}
function parseCategoryTexts(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  const obj = raw;
  for (const k of CELL_KEYS) {
    const v = obj[k];
    if (typeof v === "string") out[k] = v;
  }
  return out;
}
async function loadOverride(prisma, academicYear, month, studentId) {
  const row = await prisma.monthlyNotificationOverride.findUnique({
    where: {
      academicYear_month_studentId: { academicYear, month, studentId }
    },
    select: {
      categoryTexts: true,
      classDaysOverride: true,
      overrideReason: true,
      issueDate: true,
      updatedAt: true,
      updatedById: true
    }
  });
  if (!row) return null;
  return {
    categoryTexts: parseCategoryTexts(row.categoryTexts),
    classDaysOverride: row.classDaysOverride,
    overrideReason: row.overrideReason,
    issueDate: row.issueDate,
    updatedAt: row.updatedAt,
    updatedById: row.updatedById
  };
}
async function loadOverridesForStudents(prisma, academicYear, month, studentIds) {
  const map = /* @__PURE__ */ new Map();
  if (studentIds.length === 0) return map;
  const rows = await prisma.monthlyNotificationOverride.findMany({
    where: { academicYear, month, studentId: { in: studentIds } },
    select: {
      studentId: true,
      categoryTexts: true,
      classDaysOverride: true,
      overrideReason: true,
      issueDate: true,
      updatedAt: true,
      updatedById: true
    }
  });
  for (const r of rows) {
    map.set(r.studentId, {
      categoryTexts: parseCategoryTexts(r.categoryTexts),
      classDaysOverride: r.classDaysOverride,
      overrideReason: r.overrideReason,
      issueDate: r.issueDate,
      updatedAt: r.updatedAt,
      updatedById: r.updatedById
    });
  }
  return map;
}
function computeNotificationStatus(input) {
  const ov = input.override;
  if (!ov) return "\uCD08\uC548";
  if (ov.classDaysOverride !== null) return "\uD3B8\uC9D1\uB428";
  if (ov.issueDate !== null) return "\uD3B8\uC9D1\uB428";
  for (const k of CELL_KEYS) {
    const v = ov.categoryTexts[k];
    if (typeof v === "string" && v.trim().length > 0) return "\uD3B8\uC9D1\uB428";
  }
  return "\uCD08\uC548";
}
async function loadListData(prisma, input) {
  const range = monthBounds(input.academicYear, input.month);
  const [schedules, students] = await Promise.all([
    loadMonthSchedules(prisma, range),
    prisma.student.findMany({
      where: {
        isActive: true,
        academicYear: input.academicYear,
        classGroupId: input.classGroupId
      },
      orderBy: [
        { schoolLevel: "asc" },
        { grade: "asc" },
        { yeroomNumber: "asc" }
      ],
      include: {
        classGroup: {
          select: {
            id: true,
            name: true,
            homeroomStaff: { select: { name: true } }
          }
        }
      }
    })
  ]);
  const classDaysAuto = computeClassDaysAuto(
    range.calendarYear,
    range.calendarMonth,
    schedules
  ).auto;
  const studentRows = students.map((s) => ({
    // eslint-disable-line @typescript-eslint/no-explicit-any
    id: s.id,
    name: s.name,
    academicYear: s.academicYear,
    schoolLevel: s.schoolLevel,
    grade: _nullishCoalesce(s.grade, () => ( 0)),
    yeroomNumber: s.yeroomNumber,
    classGroupId: _nullishCoalesce(_optionalChain([s, 'access', _5 => _5.classGroup, 'optionalAccess', _6 => _6.id]), () => ( input.classGroupId)),
    classGroupName: _nullishCoalesce(_optionalChain([s, 'access', _7 => _7.classGroup, 'optionalAccess', _8 => _8.name]), () => ( "")),
    homeSchoolName: s.homeSchoolName,
    homeSchoolGrade: s.homeSchoolGrade,
    homeSchoolClass: s.homeSchoolClass,
    homeSchoolNumber: s.homeSchoolNumber,
    consignmentStartDate: s.consignmentStartDate,
    homeroomStaffName: _nullishCoalesce(_optionalChain([s, 'access', _9 => _9.classGroup, 'optionalAccess', _10 => _10.homeroomStaff, 'optionalAccess', _11 => _11.name]), () => ( ""))
  }));
  const studentIds = studentRows.map((s) => s.id);
  const [entriesByStudent, overrides] = await Promise.all([
    loadEntriesForStudents(prisma, studentIds, range),
    loadOverridesForStudents(prisma, input.academicYear, input.month, studentIds)
  ]);
  const items = studentRows.map((s) => {
    const entries = _nullishCoalesce(entriesByStudent.get(s.id), () => ( []));
    const { counts, drafts } = aggregateEntries(entries);
    const ov = _nullishCoalesce(overrides.get(s.id), () => ( null));
    const cd = resolveClassDaysEffective({
      auto: classDaysAuto,
      override: _nullishCoalesce(_optionalChain([ov, 'optionalAccess', _12 => _12.classDaysOverride]), () => ( null))
    });
    return {
      student: s,
      counts,
      drafts,
      classDays: { value: cd.value, overridden: cd.overridden, auto: classDaysAuto },
      override: ov,
      status: computeNotificationStatus({ override: ov })
    };
  });
  return { classDaysAuto, items, range };
}
async function loadStudentData(prisma, input) {
  const range = monthBounds(input.academicYear, input.month);
  const student = await prisma.student.findUnique({
    where: { id: input.studentId },
    include: {
      classGroup: {
        select: {
          id: true,
          name: true,
          homeroomStaff: { select: { name: true } }
        }
      }
    }
  });
  if (!student) return null;
  if (student.academicYear !== input.academicYear) return null;
  const studentRow = {
    id: student.id,
    name: student.name,
    academicYear: student.academicYear,
    schoolLevel: student.schoolLevel,
    grade: _nullishCoalesce(student.grade, () => ( 0)),
    yeroomNumber: student.yeroomNumber,
    classGroupId: _nullishCoalesce(_nullishCoalesce(_optionalChain([student, 'access', _13 => _13.classGroup, 'optionalAccess', _14 => _14.id]), () => ( student.classGroupId)), () => ( "")),
    classGroupName: _nullishCoalesce(_optionalChain([student, 'access', _15 => _15.classGroup, 'optionalAccess', _16 => _16.name]), () => ( "")),
    homeSchoolName: student.homeSchoolName,
    homeSchoolGrade: student.homeSchoolGrade,
    homeSchoolClass: student.homeSchoolClass,
    homeSchoolNumber: student.homeSchoolNumber,
    consignmentStartDate: student.consignmentStartDate,
    homeroomStaffName: _nullishCoalesce(_optionalChain([student, 'access', _17 => _17.classGroup, 'optionalAccess', _18 => _18.homeroomStaff, 'optionalAccess', _19 => _19.name]), () => ( ""))
  };
  const [schedules, entriesByStudent, override] = await Promise.all([
    loadMonthSchedules(prisma, range),
    loadEntriesForStudents(prisma, [student.id], range),
    loadOverride(prisma, input.academicYear, input.month, student.id)
  ]);
  const classDaysAuto = computeClassDaysAuto(
    range.calendarYear,
    range.calendarMonth,
    schedules
  ).auto;
  const entries = _nullishCoalesce(entriesByStudent.get(student.id), () => ( []));
  const { counts, drafts } = aggregateEntries(entries);
  const cd = resolveClassDaysEffective({
    auto: classDaysAuto,
    override: _nullishCoalesce(_optionalChain([override, 'optionalAccess', _20 => _20.classDaysOverride]), () => ( null))
  });
  void makeEmptyCounts;
  void makeEmptyDrafts;
  return {
    student: studentRow,
    counts,
    drafts,
    classDays: { value: cd.value, overridden: cd.overridden, auto: classDaysAuto },
    override,
    range
  };
}





























































exports.CATEGORIES = CATEGORIES; exports.CELL_KEYS = CELL_KEYS; exports.CLASS_DAY_TYPES = CLASS_DAY_TYPES; exports.DAY_TYPES = DAY_TYPES; exports.DAY_TYPE_COLORS = DAY_TYPE_COLORS; exports.DAY_TYPE_LABELS = DAY_TYPE_LABELS; exports.DAY_TYPE_SYMBOLS = DAY_TYPE_SYMBOLS; exports.HOLIDAY_DAY_TYPES = HOLIDAY_DAY_TYPES; exports.LEGACY_ENTRY_KEYS = LEGACY_ENTRY_KEYS; exports.LEGACY_KEY_MESSAGE = LEGACY_KEY_MESSAGE; exports.REASONS = REASONS; exports.SCHOOL_LEVEL_LONG = SCHOOL_LEVEL_LONG; exports.SCHOOL_LEVEL_SHORT = SCHOOL_LEVEL_SHORT; exports.academicYearToCalendarYear = academicYearToCalendarYear; exports.aggregateEntries = aggregateEntries; exports.calculateMonthSummaries = calculateMonthSummaries; exports.calculateWeekSummary = calculateWeekSummary; exports.classDayEntryUpdateSchema = classDayEntryUpdateSchema; exports.classDayPlanCreateSchema = classDayPlanCreateSchema; exports.classifyDate = classifyDate; exports.computeClassDaysAuto = computeClassDaysAuto; exports.computeNotificationStatus = computeNotificationStatus; exports.detectLegacyEntryKeys = detectLegacyEntryKeys; exports.encodeRfc5987 = encodeRfc5987; exports.entryBulkUpsertSchema = entryBulkUpsertSchema; exports.entryChangeSchema = entryChangeSchema; exports.entryListQuerySchema = entryListQuerySchema; exports.formatDateOnly = formatDateOnly; exports.formatSchoolLevel = formatSchoolLevel; exports.getCurrentStaffId = getCurrentStaffId; exports.groupEntriesByWeek = groupEntriesByWeek; exports.isAccessibleGroupId = isAccessibleGroupId; exports.loadListData = loadListData; exports.loadMonthSchedules = loadMonthSchedules; exports.loadOverride = loadOverride; exports.loadOverridesForStudents = loadOverridesForStudents; exports.loadStudentData = loadStudentData; exports.makeEmptyCounts = makeEmptyCounts; exports.makeEmptyDrafts = makeEmptyDrafts; exports.mergeStudentForCrossField = mergeStudentForCrossField; exports.monthBounds = monthBounds; exports.normalizeKoreanPhone = normalizeKoreanPhone; exports.normalizeName = normalizeName; exports.notificationBulkZipQuerySchema = notificationBulkZipQuerySchema; exports.notificationListQuerySchema = notificationListQuerySchema; exports.overridePutSchema = overridePutSchema; exports.parseCategoryTexts = parseCategoryTexts; exports.parseDateOnly = parseDateOnly; exports.resolveAccessibleGroups = resolveAccessibleGroups; exports.resolveCellTexts = resolveCellTexts; exports.resolveClassDaysEffective = resolveClassDaysEffective; exports.sanitizeFilename = sanitizeFilename; exports.schoolLevelSchema = schoolLevelSchema; exports.studentCreateSchema = studentCreateSchema; exports.studentUpdateSchema = studentUpdateSchema; exports.toDateOnlyString = toDateOnlyString; exports.todayKstString = todayKstString; exports.validateCellKeySet = validateCellKeySet; exports.validateGuardianSlots = validateGuardianSlots; exports.validateStudentCrossFields = validateStudentCrossFields;
//# sourceMappingURL=index.js.map