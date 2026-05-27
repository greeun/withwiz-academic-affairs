import { describe, expect, it } from 'vitest';
import { AcademicAffairsError } from '../src/errors';

describe('AcademicAffairsError', () => {
  it('carries code, message, and httpStatus', () => {
    const err = new AcademicAffairsError('NOT_FOUND', 'Staff not found', 404);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AcademicAffairsError);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Staff not found');
    expect(err.httpStatus).toBe(404);
    expect(err.name).toBe('AcademicAffairsError');
  });

  it('defaults httpStatus to 500 when omitted', () => {
    const err = new AcademicAffairsError('INTERNAL', 'boom');
    expect(err.httpStatus).toBe(500);
  });

  it('preserves cause when provided', () => {
    const root = new Error('root');
    const err = new AcademicAffairsError('WRAPPED', 'wrapped', 500, { cause: root });
    expect(err.cause).toBe(root);
  });
});
