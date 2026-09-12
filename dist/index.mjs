import {
  createSchoolAffairs
} from "./chunk-WRJCFX4U.mjs";
import "./chunk-MGBP2Z6J.mjs";
import {
  createMenuApi
} from "./chunk-VQZ32TWX.mjs";
import {
  STANDARD_SCHOOL_ROLES
} from "./chunk-2NGCPKLV.mjs";
import {
  permissionsOf
} from "./chunk-PKLKFT73.mjs";
import "./chunk-4JRVOD5W.mjs";
import {
  cn,
  formatDate,
  timeAgo
} from "./chunk-OXW2B2Q3.mjs";
import "./chunk-FGZMG5A6.mjs";
import "./chunk-H43BUZKY.mjs";
import "./chunk-GWQMMN7I.mjs";
import {
  AdminManagerBase,
  ImageDropUpload,
  ToggleSwitch
} from "./chunk-5ZEXSS77.mjs";
import {
  AdminShell
} from "./chunk-F63PVXD3.mjs";
import "./chunk-BVQRDAR7.mjs";
import {
  useAdminForm,
  useAdminList,
  useImageDropZone
} from "./chunk-4DTUND3E.mjs";
import {
  resizeImageIfNeeded,
  validateImageSize
} from "./chunk-J5N76ASB.mjs";
import {
  adminFetch
} from "./chunk-JSUEPRBT.mjs";
import {
  SystemClock,
  getPrisma,
  setPrisma
} from "./chunk-U75OUXOP.mjs";
import {
  withAdminApi,
  withAuthApi,
  withCustomApi,
  withPublicApi
} from "./chunk-H2EA26KT.mjs";
import "./chunk-RQZXAC67.mjs";
import {
  DEFAULT_LIST_LIMIT,
  MAX_LIST_LIMIT,
  adaptContextWrapper,
  createAcademicCalendarHandlers,
  createAcademicSystem,
  createAdmissionHandlers,
  createAttendanceHandlers,
  createCounselingHandlers,
  createDashboardHandlers,
  createFaqHandlers,
  createStaffHandlers,
  createStudentHandlers,
  guard,
  listQuerySchema,
  parseQuery,
  queryObject,
  resolveParam
} from "./chunk-DAUKROHJ.mjs";
import {
  NextApiResponse
} from "./chunk-4AHS2SIY.mjs";
import {
  LONG_TEXT_MAX,
  MAX_BULK_ATTENDANCE,
  MEDIUM_TEXT_MAX,
  PHONE_MAX,
  SHORT_TEXT_MAX,
  URL_MAX,
  academicEventTypeEnum,
  attendanceStatusEnum,
  bulkAttendanceSchema,
  counselingStatusEnum,
  counselingTypeEnum,
  createAcademicEventSchema,
  createAdmissionRegistrationSchema,
  createAdmissionSessionSchema,
  createAttendanceSchema,
  createCounselingSchema,
  createFaqCategorySchema,
  createFaqSchema,
  createStaffSchema,
  createStudentSchema,
  createTimetableSchema,
  hexColor,
  isSafeUrl,
  longText,
  mediumText,
  partialUpdate,
  phoneText,
  registrationStatusEnum,
  safeUrl,
  shortText,
  studentStatusEnum,
  updateAcademicEventSchema,
  updateAdmissionRegistrationSchema,
  updateAdmissionSessionSchema,
  updateAttendanceSchema,
  updateCounselingSchema,
  updateFaqCategorySchema,
  updateFaqSchema,
  updateStaffSchema,
  updateStudentSchema,
  updateTimetableSchema
} from "./chunk-T3WKWIOX.mjs";
import {
  AcademicAffairsError
} from "./chunk-QIK4YES6.mjs";
import {
  AcademicCalendarService,
  AdmissionService,
  AttendanceService,
  CounselingService,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  FaqService,
  STUDENT_SUMMARY_SELECT,
  StaffService,
  StudentService,
  parseSortParam
} from "./chunk-ACPRHA5C.mjs";
import {
  buildPaginatedResult
} from "./chunk-5U4CAFCL.mjs";
export {
  AcademicAffairsError,
  AcademicCalendarService,
  AdminManagerBase,
  AdminShell,
  AdmissionService,
  AttendanceService,
  CounselingService,
  DEFAULT_LIMIT,
  DEFAULT_LIST_LIMIT,
  DEFAULT_PAGE,
  FaqService,
  ImageDropUpload,
  LONG_TEXT_MAX,
  MAX_BULK_ATTENDANCE,
  MAX_LIST_LIMIT,
  MEDIUM_TEXT_MAX,
  NextApiResponse,
  PHONE_MAX,
  SHORT_TEXT_MAX,
  STANDARD_SCHOOL_ROLES,
  STUDENT_SUMMARY_SELECT,
  StaffService,
  StudentService,
  SystemClock,
  ToggleSwitch,
  URL_MAX,
  academicEventTypeEnum,
  adaptContextWrapper,
  adminFetch,
  attendanceStatusEnum,
  buildPaginatedResult,
  bulkAttendanceSchema,
  cn,
  counselingStatusEnum,
  counselingTypeEnum,
  createAcademicCalendarHandlers,
  createAcademicEventSchema,
  createAcademicSystem,
  createAdmissionHandlers,
  createAdmissionRegistrationSchema,
  createAdmissionSessionSchema,
  createAttendanceHandlers,
  createAttendanceSchema,
  createCounselingHandlers,
  createCounselingSchema,
  createDashboardHandlers,
  createFaqCategorySchema,
  createFaqHandlers,
  createFaqSchema,
  createMenuApi,
  createSchoolAffairs,
  createStaffHandlers,
  createStaffSchema,
  createStudentHandlers,
  createStudentSchema,
  createTimetableSchema,
  formatDate,
  getPrisma,
  guard,
  hexColor,
  isSafeUrl,
  listQuerySchema,
  longText,
  mediumText,
  parseQuery,
  parseSortParam,
  partialUpdate,
  permissionsOf,
  phoneText,
  queryObject,
  registrationStatusEnum,
  resizeImageIfNeeded,
  resolveParam,
  safeUrl,
  setPrisma,
  shortText,
  studentStatusEnum,
  timeAgo,
  updateAcademicEventSchema,
  updateAdmissionRegistrationSchema,
  updateAdmissionSessionSchema,
  updateAttendanceSchema,
  updateCounselingSchema,
  updateFaqCategorySchema,
  updateFaqSchema,
  updateStaffSchema,
  updateStudentSchema,
  updateTimetableSchema,
  useAdminForm,
  useAdminList,
  useImageDropZone,
  validateImageSize,
  withAdminApi,
  withAuthApi,
  withCustomApi,
  withPublicApi
};
//# sourceMappingURL=index.mjs.map