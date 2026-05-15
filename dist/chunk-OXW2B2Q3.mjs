// src/utils/cn.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/utils/date.ts
function formatDate(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "\uBC29\uAE08";
  if (mins < 60) return `${mins}\uBD84 \uC804`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}\uC2DC\uAC04 \uC804`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}\uC77C \uC804`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export {
  cn,
  formatDate,
  timeAgo
};
//# sourceMappingURL=chunk-OXW2B2Q3.mjs.map