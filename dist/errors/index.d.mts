type AcademicAffairsErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT' | 'INTERNAL' | 'WRAPPED';
interface AcademicAffairsErrorOptions {
    cause?: unknown;
}
declare class AcademicAffairsError extends Error {
    readonly code: string;
    readonly httpStatus: number;
    readonly cause?: unknown;
    constructor(code: string, message: string, httpStatus?: number, options?: AcademicAffairsErrorOptions);
}

export { AcademicAffairsError, type AcademicAffairsErrorCode, type AcademicAffairsErrorOptions };
