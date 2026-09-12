export { createAcademicSystem } from './create-system';
export { createStaffHandlers } from './staff.handler';
export { createAcademicCalendarHandlers } from './academic-calendar.handler';
export { createFaqHandlers } from './faq.handler';
export { createStudentHandlers } from './student.handler';
export { createAttendanceHandlers } from './attendance.handler';
export { createCounselingHandlers } from './counseling.handler';
export { createAdmissionHandlers } from './admission.handler';
export { createDashboardHandlers } from './dashboard.handler';
export {
  guard,
  parseQuery,
  queryObject,
  resolveParam,
  adaptContextWrapper,
  listQuerySchema,
  MAX_LIST_LIMIT,
  DEFAULT_LIST_LIMIT,
} from './route';
export type { AdminApiWrapper, ContextLike } from './route';
export type { AcademicSystemConfig } from './create-system';
