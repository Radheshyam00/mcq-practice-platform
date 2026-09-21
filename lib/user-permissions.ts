export const USER_ROLES = [
  "student",
  "user",
  "admin",
  "super-admin",
  "question-manager",
  "exam-manager",
  "result-manager",
  "user-manager",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "blocked",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const ADMIN_ROLES: UserRole[] = [
  "admin",
  "super-admin",
  "question-manager",
  "exam-manager",
  "result-manager",
  "user-manager",
];

export const PERMISSIONS = [
  {
    id: "dashboard.view",
    label: "View Dashboard",
    category: "Dashboard",
  },

  {
    id: "questions.view",
    label: "View Questions",
    category: "Questions",
  },
  {
    id: "questions.create",
    label: "Create Questions",
    category: "Questions",
  },
  {
    id: "questions.edit",
    label: "Edit Questions",
    category: "Questions",
  },
  {
    id: "questions.delete",
    label: "Delete Questions",
    category: "Questions",
  },
  {
    id: "questions.import",
    label: "Import Questions",
    category: "Questions",
  },

  {
    id: "exams.view",
    label: "View Exams",
    category: "Exams",
  },
  {
    id: "exams.create",
    label: "Create Exams",
    category: "Exams",
  },
  {
    id: "exams.edit",
    label: "Edit Exams",
    category: "Exams",
  },
  {
    id: "exams.delete",
    label: "Delete Exams",
    category: "Exams",
  },

  {
    id: "users.view",
    label: "View Users",
    category: "Users",
  },
  {
    id: "users.create",
    label: "Create Users",
    category: "Users",
  },
  {
    id: "users.edit",
    label: "Edit Users",
    category: "Users",
  },
  {
    id: "users.delete",
    label: "Delete Users",
    category: "Users",
  },
  {
    id: "users.block",
    label: "Block / Unblock Users",
    category: "Users",
  },

  {
    id: "mock-tests.view",
    label: "View Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.create",
    label: "Create Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.edit",
    label: "Edit Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.delete",
    label: "Delete Mock Tests",
    category: "Mock Tests",
  },

  {
    id: "results.view",
    label: "View Results",
    category: "Results",
  },
] as const;

export type PermissionId = (typeof PERMISSIONS)[number]["id"];

export const ALL_PERMISSION_IDS = PERMISSIONS.map(
  (permission) => permission.id
);

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}