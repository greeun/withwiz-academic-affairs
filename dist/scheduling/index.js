"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/scheduling/schedule.ts
var _zod = require('zod');
var academicScheduleSchema = _zod.z.object({
  academicYear: _zod.z.number().int().min(2020).max(2100),
  semester: _zod.z.enum(["FIRST", "SECOND"]),
  title: _zod.z.string().min(1, "\uC77C\uC815\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694").max(100),
  startDate: _zod.z.string().min(1, "\uC2DC\uC791\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694"),
  endDate: _zod.z.string().optional().default(""),
  scheduleType: _zod.z.enum([
    "HOLIDAY",
    "EVENT",
    "EXAM",
    "VACATION",
    "FIELD_TRIP",
    "OTHER"
  ]),
  isHighlight: _zod.z.boolean().default(false),
  sortOrder: _zod.z.number().int().default(0),
  schoolLevel: _zod.z.union([_zod.z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]), _zod.z.literal(""), _zod.z.null()]).optional().transform((v) => v === "" || v === void 0 ? null : v)
});
var SCHOOL_LEVEL_LABELS = {
  ELEMENTARY: "\uCD08\uB4F1",
  MIDDLE: "\uC911\uB4F1",
  HIGH: "\uACE0\uB4F1"
};
var SEMESTER_LABELS = {
  FIRST: "1\uD559\uAE30",
  SECOND: "2\uD559\uAE30"
};
var SCHEDULE_TYPE_LABELS = {
  HOLIDAY: "\uACF5\uD734\uC77C",
  EVENT: "\uD589\uC0AC",
  EXAM: "\uC2DC\uD5D8",
  VACATION: "\uBC29\uD559",
  FIELD_TRIP: "\uCCB4\uD5D8\uD559\uC2B5",
  OTHER: "\uAE30\uD0C0"
};
var SCHEDULE_TYPE_COLORS = {
  HOLIDAY: { bg: "#FEE2E2", text: "#DC2626" },
  EVENT: { bg: "#DBEAFE", text: "#2563EB" },
  EXAM: { bg: "#FEF3C7", text: "#D97706" },
  VACATION: { bg: "#D1FAE5", text: "#059669" },
  FIELD_TRIP: { bg: "#E0E7FF", text: "#4F46E5" },
  OTHER: { bg: "#F3F4F6", text: "#6B7280" }
};
function formatScheduleDate(startDate, endDate) {
  const fmt = (d) => {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}\uC6D4 ${day}\uC77C`;
  };
  if (!endDate) return fmt(startDate);
  return `${fmt(startDate)}~${fmt(endDate)}`;
}

// src/scheduling/validators.ts

var dayOfWeekEnum = _zod.z.enum(["MON", "TUE", "WED", "THU", "FRI"]);
var cellSchema = _zod.z.object({
  dayOfWeek: dayOfWeekEnum,
  content: _zod.z.string()
});
var timeSlotSchema = _zod.z.object({
  time: _zod.z.string().min(1, "\uC2DC\uAC04\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."),
  sortOrder: _zod.z.number().int().min(0),
  cells: _zod.z.array(cellSchema).min(1, "\uCD5C\uC18C 1\uAC1C \uC694\uC77C\uC758 \uC218\uC5C5 \uB0B4\uC6A9\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.")
});
var scheduleCreateSchema = _zod.z.object({
  schoolLevel: _zod.z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]),
  semester: _zod.z.number().int().min(1).max(2),
  year: _zod.z.number().int().min(2020).max(2100),
  title: _zod.z.string().min(1, "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."),
  description: _zod.z.string().nullish(),
  timeSlots: _zod.z.array(timeSlotSchema).min(1, "\uCD5C\uC18C 1\uAC1C \uC2DC\uAC04\uB300\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.")
});
var scheduleUpdateSchema = scheduleCreateSchema;

// src/scheduling/parse-subject-field.ts
var LEVEL_TOKEN_MAP = {
  "\uCD08": "ELEMENTARY",
  "\uCD08\uB4F1": "ELEMENTARY",
  "\uC911": "MIDDLE",
  "\uC911\uB4F1": "MIDDLE",
  "\uACE0": "HIGH",
  "\uACE0\uB4F1": "HIGH"
};
function parseLevelTokens(raw) {
  const tokens = raw.split(/[.,/\s]+/).map((s) => s.trim()).filter(Boolean);
  const set = /* @__PURE__ */ new Set();
  for (const t of tokens) {
    const mapped = LEVEL_TOKEN_MAP[t];
    if (mapped) set.add(mapped);
  }
  return Array.from(set);
}
function inferLevelsFromPosition(position) {
  if (!position) return [];
  return parseLevelTokens(position);
}
function parseSubjectField(raw, position) {
  if (raw == null) return [];
  const text = String(raw).trim();
  if (!text) return [];
  let bracketLevels = null;
  let stripped = text;
  const bracketRegex = /\(([^()]*)\)\s*$/u;
  const match = text.match(bracketRegex);
  if (match) {
    bracketLevels = parseLevelTokens(match[1]);
    stripped = text.slice(0, match.index).trim();
  }
  const positionLevels = inferLevelsFromPosition(_nullishCoalesce(position, () => ( null)));
  const levels = bracketLevels && bracketLevels.length > 0 ? bracketLevels : positionLevels;
  const names = stripped.split(",").map((s) => s.trim()).filter(Boolean);
  return names.map((name) => ({ name, levels: [...levels] }));
}










exports.SCHEDULE_TYPE_COLORS = SCHEDULE_TYPE_COLORS; exports.SCHEDULE_TYPE_LABELS = SCHEDULE_TYPE_LABELS; exports.SCHOOL_LEVEL_LABELS = SCHOOL_LEVEL_LABELS; exports.SEMESTER_LABELS = SEMESTER_LABELS; exports.academicScheduleSchema = academicScheduleSchema; exports.formatScheduleDate = formatScheduleDate; exports.parseSubjectField = parseSubjectField; exports.scheduleCreateSchema = scheduleCreateSchema; exports.scheduleUpdateSchema = scheduleUpdateSchema;
//# sourceMappingURL=index.js.map