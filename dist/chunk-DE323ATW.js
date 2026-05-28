"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/errors/academic-affairs-error.ts
var AcademicAffairsError = class _AcademicAffairsError extends Error {
  
  
  
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



exports.AcademicAffairsError = AcademicAffairsError;
//# sourceMappingURL=chunk-DE323ATW.js.map