import { TGender, TRoleType, TSkillLevel } from "@/typings";

export const REPEATING_TEXT = {
  formDescription: "Please fill up the required fields.",
};
export const ADMIN_LINKS = [
  {
    id: "dashboard",
    path: "/admin",
    label: "Dashboard",
  },
  {
    id: "members",
    path: "/admin/members",
    label: "Members",
  },
  {
    id: "courts",
    path: "/admin/courts",
    label: "Courts",
  },
  {
    id: "settings",
    path: "/admin/settings",
    label: "Settings",
  },
];
export const SKILL_LEVEL = {
  BEGINNER: {
    id: "BEGINNER" as TSkillLevel,
    label: "Beginner",
    description:
      "New to pickleball. Learning rules, basic strokes, and court positioning.",
    color: {
      text: "#22c55e", // gray-500
    },
  },
  NOVICE: {
    id: "NOVICE" as TSkillLevel,
    label: "Novice",
    description:
      "Understands rules and basic positioning. Can rally and serve consistently but lacks shot control and strategy.",
    color: {
      text: "#3B82F6", // blue-500
    },
  },
  INTERMEDIATE: {
    id: "INTERMEDIATE" as TSkillLevel,
    label: "Intermediate",
    description:
      "Consistent rallies, basic dinking and third-shot drops. Developing strategy and court awareness.",
    color: {
      text: "#f43f5e", // green-500
    },
  },
  ADVANCED: {
    id: "ADVANCED" as TSkillLevel,
    label: "Advanced",
    description:
      "Strong control, consistent dinks and resets. Uses strategy, pace, and placement effectively.",
    color: {
      text: "#eab308", // orange-500
    },
  },
  ADVANCED_INTERMEDIATE: {
    id: "ADVANCED_INTERMEDIATE" as TSkillLevel,
    label: "Advanced Intermediate",
    description:
      "Reliable dinks, third-shot drops, and resets. Understands positioning, stacking, and shot selection but lacks elite consistency.",
    color: {
      text: "#10b981", // emerald-500
    },
  },
  PRO: {
    id: "PRO" as TSkillLevel,
    label: "Open / Pro",
    description:
      "High-level competitive player with advanced tactics, consistency, and tournament experience.",
    color: {
      text: "#a855f7", // red-500
    },
  },
} as const;

export const SKILL_LEVELS = [
  SKILL_LEVEL.BEGINNER,
  SKILL_LEVEL.NOVICE,
  SKILL_LEVEL.INTERMEDIATE,
  SKILL_LEVEL.ADVANCED_INTERMEDIATE,
  SKILL_LEVEL.ADVANCED,
  SKILL_LEVEL.PRO,
];
export const ROLE_TYPE = {
  ADMIN: "ADMIN" as TRoleType,
  MEMBER: "MEMBER" as TRoleType,
  VISITOR: "VISITOR" as TRoleType,
  MANAGER: "MANAGER" as TRoleType,
};
export const ROLE_TYPES = [
  ROLE_TYPE.ADMIN,
  ROLE_TYPE.MEMBER,
  ROLE_TYPE.VISITOR,
  ROLE_TYPE.MANAGER,
];
export const OPTIONS_HOUR = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 1; // Generates numbers from 1 to 12
  return {
    value: hour.toString(),
    label: `${hour}`,
  };
});

export const OPTIONS_MINUTE = Array.from({ length: 12 }, (_, index) => {
  const minute = index * 5; // Generates 0, 5, 10, ..., 55
  return {
    value: minute.toString().padStart(2, "0"), // Ensures two-digit format
    label: minute.toString().padStart(2, "0"),
  };
});
export const DB_METHOD_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
};
export const GENDERS = [
  {
    id: "MALE" as TGender,
    label: "Male",
  },
  {
    id: "FEMALE" as TGender,
    label: "Female",
  },
];

export const DB_COLLECTION = {
  SPORTS: "sports",
  FACILITIES: "facilities",
  USERS: "users",
  SESSIONS: "sessions",
  MEMBERS: "members",
  COURTS: "courts",
};

export const PH_PROVINCES: string[] = [
  "Abra",
  "Agusan del Norte",
  "Agusan del Sur",
  "Aklan",
  "Albay",
  "Antique",
  "Apayao",
  "Aurora",
  "Basilan",
  "Bataan",
  "Batanes",
  "Batangas",
  "Benguet",
  "Biliran",
  "Bohol",
  "Bukidnon",
  "Bulacan",
  "Cagayan",
  "Camarines Norte",
  "Camarines Sur",
  "Camiguin",
  "Capiz",
  "Catanduanes",
  "Cavite",
  "Cebu",
  "Cotabato",
  "Davao de Oro",
  "Davao del Norte",
  "Davao del Sur",
  "Davao Occidental",
  "Davao Oriental",
  "Dinagat Islands",
  "Eastern Samar",
  "Guimaras",
  "Ifugao",
  "Ilocos Norte",
  "Ilocos Sur",
  "Iloilo",
  "Isabela",
  "Kalinga",
  "La Union",
  "Laguna",
  "Lanao del Norte",
  "Lanao del Sur",
  "Leyte",
  "Maguindanao del Norte",
  "Maguindanao del Sur",
  "Marinduque",
  "Masbate",
  "Misamis Occidental",
  "Misamis Oriental",
  "Mountain Province",
  "Negros Occidental",
  "Negros Oriental",
  "Northern Samar",
  "Nueva Ecija",
  "Nueva Vizcaya",
  "Occidental Mindoro",
  "Oriental Mindoro",
  "Palawan",
  "Pampanga",
  "Pangasinan",
  "Quezon",
  "Quirino",
  "Rizal",
  "Romblon",
  "Samar",
  "Sarangani",
  "Siquijor",
  "Sorsogon",
  "South Cotabato",
  "Southern Leyte",
  "Sultan Kudarat",
  "Sulu",
  "Surigao del Norte",
  "Surigao del Sur",
  "Tarlac",
  "Tawi-Tawi",
  "Zambales",
  "Zamboanga del Norte",
  "Zamboanga del Sur",
  "Zamboanga Sibugay",
];
