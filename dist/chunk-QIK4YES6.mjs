// src/errors/academic-affairs-error.ts
var AcademicAffairsError = class _AcademicAffairsError extends Error {
  code;
  httpStatus;
  cause;
  constructor(code, message, httpStatus = 500, options = {}) {
    super(message);
    this.name = "AcademicAffairsError";
    this.code = code;
    this.httpStatus = httpStatus;
    if (options.cause !== void 0) this.cause = options.cause;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _AcademicAffairsError);
    }
  }
};

export {
  AcademicAffairsError
};
//# sourceMappingURL=chunk-QIK4YES6.mjs.map