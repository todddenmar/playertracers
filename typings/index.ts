import { FieldValue } from "firebase/firestore";

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
  homeFacilityID: string; // where a player is a member
};

export type TActivity = {
  id: string;
  date: string;
  timestamp: FieldValue;
  players: TPlayer[];
};

export type TCourt = {
  id: string;
  name: string;
  order: number;
  facilityID: string;
};
export type TFacility = {
  id: string;
  description: string;
  name: string;
  sportIDs: string[]; //can add multiple sports
  address: string;
  city: string;
  province: string;
};
