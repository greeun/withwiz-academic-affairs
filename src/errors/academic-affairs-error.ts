export type AcademicAffairsErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'INTERNAL'
  | 'WRAPPED';

export interface AcademicAffairsErrorOptions {
  cause?: unknown;
}

export class AcademicAffairsError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  override readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    httpStatus: number = 500,
    options: AcademicAffairsErrorOptions = {}
  ) {
    super(message);
    this.name = 'AcademicAffairsError';
    this.code = code;
    this.httpStatus = httpStatus;
    if (options.cause !== undefined) this.cause = options.cause;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AcademicAffairsError);
    }
  }
}
