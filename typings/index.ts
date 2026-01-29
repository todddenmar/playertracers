import { FieldValue } from "firebase/firestore";

export type TRoleType = "MEMBER" | "MANAGER" | "ADMIN";
export type TSkillLevel =
  | "BEGINNER"
  | "NOVICE"
  | "INTERMEDIATE"
  | "ADVANCED_INTERMEDIATE"
  | "ADVANCED"
  | "PRO";
export type TUser = {
  uid?: string;
  id: string;
  isVerified: boolean;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  photoURL?: string | null;
  createdAt?: string;
  timestamp?: FieldValue | string;
  updatedAt?: string;
};
export type TFirebaseUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
};
export type TSport = {
  id: string;
  name: string;
  description: string;
};

export type TPlayer = {
  id: string;
  firstname: string;
  lastname: string;
  sportIDs: string[];
  alias: string;
  homeFacilityID: string; // where a player is a member
};
export type TGender = "MALE" | "FEMALE";

export type TMembership = {
  id: string;
  playerID: string | null;
  expirationDate: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  skillLevel: string;
  mobileNumber: string;
  gender: TGender;
};

export type TSessionType = "RENTAL" | "OPEN_PLAY";
export type TPeriod = "AM" | "PM";

export type TTime = {
  hour: string;
  minute: string;
  period: TPeriod;
};

export type TSession = {
  id: string;
  facilityID: string;
  date: string;
  timestamp: FieldValue;
  type: TSessionType;
  players: TPlayer[];
};

export type TCourt = {
  id: string;
  name: string;
  description: string;
  orderNumber: number;
  facilityID: string;
  skillLevels: string[];
};

export type TFacilityUser = {
  userID: string;
  roleType: TRoleType | null;
};
export type TFacility = {
  id: string;
  description: string;
  name: string;
  sportIDs: string[]; //can add multiple sports
  address: string;
  city: string;
  province: string;
  facilityUsers: TFacilityUser[];
};
