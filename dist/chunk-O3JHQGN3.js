"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/presets/standard-school-roles.ts
var STANDARD_SCHOOL_ROLES = [
  {
    name: "SUPER_ADMIN",
    displayName: "\uCD5C\uACE0\uAD00\uB9AC\uC790",
    description: "\uCD5C\uACE0 \uAD00\uB9AC\uC790 \u2014 \uBAA8\uB4E0 \uBA54\uB274 \uC811\uADFC, \uC0AD\uC81C \uBD88\uAC00",
    isSystem: true,
    menuKeys: []
  },
  {
    name: "PRINCIPAL",
    displayName: "\uAD50\uC7A5",
    description: "\uAD50\uC7A5 \u2014 \uAD8C\uD55C \uAD00\uB9AC(roles) \uC678 \uC804\uCCB4",
    isSystem: false,
    menuKeys: [
      "academic.promotion",
      "attendance",
      "blog",
      "briefing",
      "class-journal",
      "consultation",
      "dashboard",
      "faq",
      "hero",
      "history",
      "news",
      "outreach.notifications",
      "resource.groups",
      "resource.students",
      "resource.subjects",
      "resource.users",
      "schedule",
      "school.viewAll",
      "settings",
      "sms",
      "student-counseling"
    ]
  },
  {
    name: "VICE_PRINCIPAL",
    displayName: "\uAD50\uAC10",
    description: "\uAD50\uAC10 \u2014 \uD559\uC0AC\xB7\uC18C\uD1B5\xB7\uB9AC\uC18C\uC2A4 \uC804\uBC18 + \uC804\uCCB4 \uC870\uD68C",
    isSystem: false,
    menuKeys: [
      "academic.promotion",
      "attendance",
      "blog",
      "briefing",
      "class-journal",
      "consultation",
      "dashboard",
      "news",
      "outreach.notifications",
      "resource.groups",
      "resource.students",
      "resource.subjects",
      "schedule",
      "school.viewAll",
      "sms",
      "student-counseling"
    ]
  },
  {
    name: "ACADEMIC_HEAD",
    displayName: "\uAD50\uBB34\uBD80\uC7A5",
    description: "\uAD50\uBB34\uBD80\uC7A5 \u2014 VICE_PRINCIPAL\uACFC \uB3D9\uC77C \uAD8C\uD55C",
    isSystem: false,
    menuKeys: [
      "academic.promotion",
      "attendance",
      "blog",
      "briefing",
      "class-journal",
      "consultation",
      "dashboard",
      "news",
      "outreach.notifications",
      "resource.groups",
      "resource.students",
      "resource.subjects",
      "schedule",
      "school.viewAll",
      "sms",
      "student-counseling"
    ]
  },
  {
    name: "ACADEMIC_AFFAIRS",
    displayName: "\uAD50\uBB34",
    description: "\uAD50\uBB34/\uAD50\uAC10 \u2014 \uC9C4\uAE09 \uB3C4\uAD6C + \uC778\uBB3C \uD504\uB85C\uD544 \uC804\uAD8C",
    isSystem: false,
    menuKeys: [
      "academic.promotion",
      "attendance",
      "outreach.notifications",
      "resource.groups",
      "resource.students"
    ]
  },
  {
    name: "HOMEROOM",
    displayName: "\uB2F4\uC784",
    description: "\uB2F4\uC784/\uBD80\uB2F4\uC784 \u2014 \uBCF8\uC778 (\uC8FC/\uBD80)\uB2F4\uC784 ClassGroup \uB370\uC774\uD130\uB9CC",
    isSystem: false,
    menuKeys: [
      "attendance",
      "class-journal",
      "dashboard",
      "outreach.notifications",
      "resource.students",
      "resource.subjects",
      "student-counseling"
    ]
  },
  {
    name: "TEACHER",
    displayName: "\uC77C\uBC18\uAD50\uC0AC",
    description: "\uB2F4\uC784 \uC544\uB2CC \uAD50\uACFC/\uD2B9\uBCC4\uAD50\uC0AC",
    isSystem: false,
    menuKeys: ["class-journal", "dashboard", "resource.subjects"]
  },
  {
    name: "instructor",
    displayName: "\uAC15\uC0AC",
    isSystem: false,
    menuKeys: ["class-journal"]
  },
  {
    name: "WEB_EDITOR",
    displayName: "\uD648\uD398\uC774\uC9C0 \uC6B4\uC601",
    description: "\uD648\uD398\uC774\uC9C0 \uCF58\uD150\uCE20\xB7\uC18C\uD1B5 \uC6B4\uC601",
    isSystem: false,
    menuKeys: [
      "blog",
      "briefing",
      "consultation",
      "dashboard",
      "faq",
      "hero",
      "history",
      "news",
      "resource.subjects"
    ]
  }
];



exports.STANDARD_SCHOOL_ROLES = STANDARD_SCHOOL_ROLES;
//# sourceMappingURL=chunk-O3JHQGN3.js.map