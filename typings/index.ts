import { FieldValue } from "firebase/firestore";

export type TRoleType = "MANAGER" | "VISITOR" | "ADMIN" | "MEMBER";
export type TSkillLevel =
  | "Beginner"
  | "Novice"
  | "Intermediate"
  | "Advanced"
  | "Open / Pro";
export type TUser = {
  uid?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  photoURL?: string | null;
  username?: string | null;
  createdAt?: string;
  roleType?: TRoleType;
  timestamp?: FieldValue | string;
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

export type TMembership = {
  id: string;
  playerID: string | null;
  expirationDate: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  skillLevel: string;
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
  order: number;
  facilityID: string;
};

export type TFacilityUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  roleType: TRoleType;
  createdAt: string;
  updatedAt?: string;
};
export type TFacility = {
  id: string;
  description: string;
  name: string;
  sportIDs: string[]; //can add multiple sports
  address: string;
  city: string;
  province: string;
  users: TFacilityUser[];
};
