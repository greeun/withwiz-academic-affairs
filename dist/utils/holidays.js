"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/utils/holidays/index.ts
var _koreanlunarcalendar = require('korean-lunar-calendar'); var _koreanlunarcalendar2 = _interopRequireDefault(_koreanlunarcalendar);
var FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: "\uC2E0\uC815", substitution: "never" },
  { month: 3, day: 1, name: "\uC0BC\uC77C\uC808", substitution: "always" },
  { month: 5, day: 5, name: "\uC5B4\uB9B0\uC774\uB0A0", substitution: "always" },
  { month: 6, day: 6, name: "\uD604\uCDA9\uC77C", substitution: "never" },
  { month: 7, day: 17, name: "\uC81C\uD5CC\uC808", substitution: "always" },
  { month: 8, day: 15, name: "\uAD11\uBCF5\uC808", substitution: "always" },
  { month: 10, day: 3, name: "\uAC1C\uCC9C\uC808", substitution: "always" },
  { month: 10, day: 9, name: "\uD55C\uAE00\uB0A0", substitution: "always" },
  { month: 12, day: 25, name: "\uC131\uD0C4\uC808", substitution: "always" }
];
var LUNAR_HOLIDAYS = [
  {
    month: 1,
    day: 1,
    name: "\uC124\uB0A0",
    spread: [-1, 0, 1],
    substitution: "sundayOnly"
  },
  { month: 4, day: 8, name: "\uBD80\uCC98\uB2D8\uC624\uC2E0\uB0A0", substitution: "always" },
  {
    month: 8,
    day: 15,
    name: "\uCD94\uC11D",
    spread: [-1, 0, 1],
    substitution: "sundayOnly"
  }
];
function lunarToSolar(year, lunarMonth, lunarDay) {
  const cal = new (0, _koreanlunarcalendar2.default)();
  const ok = cal.setLunarDate(year, lunarMonth, lunarDay, false);
  if (!ok) return null;
  const sol = cal.getSolarCalendar();
  return new Date(sol.year, sol.month - 1, sol.day);
}
function isWeekend(date) {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function nextWeekday(date) {
  let d = new Date(date);
  while (isWeekend(d)) {
    d = addDays(d, 1);
  }
  return d;
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getKoreanHolidays(year) {
  const holidays = /* @__PURE__ */ new Map();
  const allDates = [];
  for (const h of FIXED_HOLIDAYS) {
    allDates.push({
      date: new Date(year, h.month - 1, h.day),
      name: h.name,
      substitution: h.substitution
    });
  }
  for (const lh of LUNAR_HOLIDAYS) {
    const base = lunarToSolar(year, lh.month, lh.day);
    if (!base) continue;
    const offsets = _nullishCoalesce(lh.spread, () => ( [0]));
    for (const offset of offsets) {
      const solar = addDays(base, offset);
      const suffix = offset === 0 ? "" : offset === -1 ? " \uC804\uB0A0" : " \uB2E4\uC74C\uB0A0";
      allDates.push({
        date: solar,
        name: lh.name + suffix,
        substitution: lh.substitution
      });
    }
  }
  const usedDates = /* @__PURE__ */ new Set();
  for (const h of allDates) {
    usedDates.add(dateKey(h.date));
  }
  for (const h of allDates) {
    const dow = h.date.getDay();
    const needsSubstitution = h.substitution === "always" ? isWeekend(h.date) : h.substitution === "sundayOnly" ? dow === 0 : false;
    if (needsSubstitution) {
      let sub = nextWeekday(h.date);
      while (usedDates.has(dateKey(sub))) {
        sub = nextWeekday(addDays(sub, 1));
      }
      usedDates.add(dateKey(sub));
      holidays.set(dateKey(sub), `\uB300\uCCB4\uACF5\uD734\uC77C(${h.name})`);
    }
    holidays.set(dateKey(h.date), h.name);
  }
  return holidays;
}
function getSemesterRange(year, semester) {
  if (semester === "FIRST") {
    return {
      start: new Date(year, 2, 1),
      end: new Date(year, 6, 31)
    };
  }
  return {
    start: new Date(year, 7, 1),
    end: new Date(year, 11, 31)
  };
}
function generateWeekdays(start, end) {
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    if (!isWeekend(current)) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}




exports.generateWeekdays = generateWeekdays; exports.getKoreanHolidays = getKoreanHolidays; exports.getSemesterRange = getSemesterRange;
//# sourceMappingURL=holidays.js.map