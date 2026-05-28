// src/utils/academic-year/index.ts
function getAcademicYearForDate(date) {
  return date.getUTCMonth() >= 2 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
}
function getCurrentAcademicYear(now = /* @__PURE__ */ new Date()) {
  return getAcademicYearForDate(now);
}
export {
  getAcademicYearForDate,
  getCurrentAcademicYear
};
//# sourceMappingURL=academic-year.mjs.map