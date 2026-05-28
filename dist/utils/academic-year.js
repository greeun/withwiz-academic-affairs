"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/academic-year/index.ts
function getAcademicYearForDate(date) {
  return date.getUTCMonth() >= 2 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
}
function getCurrentAcademicYear(now = /* @__PURE__ */ new Date()) {
  return getAcademicYearForDate(now);
}



exports.getAcademicYearForDate = getAcademicYearForDate; exports.getCurrentAcademicYear = getCurrentAcademicYear;
//# sourceMappingURL=academic-year.js.map