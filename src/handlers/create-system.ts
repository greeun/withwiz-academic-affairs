import { StaffService } from '../services/staff.service';
import { AcademicCalendarService } from '../services/academic-calendar.service';
import { FaqService } from '../services/faq.service';
import { StudentService } from '../services/student.service';
import { AttendanceService } from '../services/attendance.service';
import { CounselingService } from '../services/counseling.service';
import { AdmissionService } from '../services/admission.service';
import { createStaffHandlers } from './staff.handler';
import { createAcademicCalendarHandlers } from './academic-calendar.handler';
import { createFaqHandlers } from './faq.handler';
import { createStudentHandlers } from './student.handler';
import { createAttendanceHandlers } from './attendance.handler';
import { createCounselingHandlers } from './counseling.handler';
import { createAdmissionHandlers } from './admission.handler';
import { createDashboardHandlers } from './dashboard.handler';

interface DomainConfig {
  staff?: boolean;
  academicCalendar?: boolean;
  faq?: boolean;
  student?: boolean;
  attendance?: boolean;
  counseling?: boolean;
  admission?: boolean;
}

interface AcademicSystemConfig {
  prisma: any;
  domains: DomainConfig;
  withAdminApi?: (handler: Function) => Function;
}

interface HandlerSet {
  list: { GET: Function; POST: Function };
  detail: { GET: Function; PUT: Function; DELETE: Function };
}

interface AcademicCalendarHandlerSet {
  list: { GET: Function; POST: Function };
  detail: { GET: Function; PUT: Function; DELETE: Function };
  eventList: { GET: Function; POST: Function };
  eventDetail: { GET: Function; PUT: Function; DELETE: Function };
}

interface DashboardHandlerSet {
  stats: { GET: Function };
}

interface AcademicSystem {
  services: {
    staff?: StaffService;
    academicCalendar?: AcademicCalendarService;
    faq?: FaqService;
    student?: StudentService;
    attendance?: AttendanceService;
    counseling?: CounselingService;
    admission?: AdmissionService;
  };
  handlers: {
    staff?: HandlerSet;
    academicCalendar?: AcademicCalendarHandlerSet;
    faq?: HandlerSet;
    student?: HandlerSet;
    attendance?: HandlerSet;
    counseling?: HandlerSet;
    admission?: HandlerSet;
    dashboard?: DashboardHandlerSet;
  };
}

// Default passthrough middleware if none provided
const defaultWithAdminApi = (handler: Function) => handler;

export function createAcademicSystem(config: AcademicSystemConfig): AcademicSystem {
  const services: AcademicSystem['services'] = {};
  const handlers: AcademicSystem['handlers'] = {};
  const withAdminApi = config.withAdminApi ?? defaultWithAdminApi;

  if (config.domains.staff) {
    services.staff = new StaffService(config.prisma);
    handlers.staff = createStaffHandlers(services.staff, withAdminApi);
  }

  if (config.domains.academicCalendar) {
    services.academicCalendar = new AcademicCalendarService(config.prisma);
    handlers.academicCalendar = createAcademicCalendarHandlers(services.academicCalendar, withAdminApi);
  }

  if (config.domains.faq) {
    services.faq = new FaqService(config.prisma);
    handlers.faq = createFaqHandlers(services.faq, withAdminApi);
  }

  if (config.domains.student) {
    services.student = new StudentService(config.prisma);
    handlers.student = createStudentHandlers(services.student, withAdminApi);
  }

  if (config.domains.attendance) {
    services.attendance = new AttendanceService(config.prisma);
    handlers.attendance = createAttendanceHandlers(services.attendance, withAdminApi);
  }

  if (config.domains.counseling) {
    services.counseling = new CounselingService(config.prisma);
    handlers.counseling = createCounselingHandlers(services.counseling, withAdminApi);
  }

  if (config.domains.admission) {
    services.admission = new AdmissionService(config.prisma);
    handlers.admission = createAdmissionHandlers(services.admission, withAdminApi);
  }

  // Dashboard aggregates stats from all enabled services
  const dashboardServices: Record<string, any> = {};
  for (const [key, service] of Object.entries(services)) {
    if (service && typeof (service as any).getStats === 'function') {
      dashboardServices[key] = service;
    }
  }
  if (Object.keys(dashboardServices).length > 0) {
    handlers.dashboard = createDashboardHandlers(dashboardServices, withAdminApi);
  }

  return { services, handlers };
}
