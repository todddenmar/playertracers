import {
  TBooking,
  TCourt,
  TFacility,
  TFirebaseUser,
  TMembership,
  TSport,
  TUser,
} from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  currentSports: TSport[];
  currentFacilities: TFacility[];
  currentUser: TUser | null;
  currentMembers: TMembership[];
  currentFacility: TFacility | null;
  currentCourts: TCourt[];
  currentUsers: TUser[];
  currentFirebaseUser: TFirebaseUser | null;
  currentBookings: TBooking[];
};

export type TAppStoreActions = {
  setCurrentSports: (currentSports: TSport[]) => void;
  setCurrentFacilities: (currentFacilities: TFacility[]) => void;
  setCurrentUser: (currentUser: TUser | null) => void;
  setCurrentFacility: (currentFacility: TFacility | null) => void;
  setCurrentMembers: (currentMembers: TMembership[]) => void;
  setCurrentCourts: (currentCourts: TCourt[]) => void;
  setCurrentUsers: (currentUsers: TUser[]) => void;
  setCurrentFirebaseUser: (currentFirebaseUser: TFirebaseUser | null) => void;
  setCurrentBookings: (currentBookings: TBooking[]) => void;
};
export const useAppStore = create<TAppStoreStates & TAppStoreActions>(
  (set) => ({
    // googleUser: null,
    // setGoogleUser: (googleUser) => set(() => ({ googleUser })),
    currentSports: [],
    setCurrentSports: (currentSports) => set(() => ({ currentSports })),
    currentFacilities: [],
    setCurrentFacilities: (currentFacilities) =>
      set(() => ({ currentFacilities })),
    currentUser: null,
    setCurrentUser: (currentUser) => set(() => ({ currentUser })),
    currentMembers: [],
    setCurrentMembers: (currentMembers) => set(() => ({ currentMembers })),
    currentCourts: [],
    setCurrentCourts: (currentCourts) => set(() => ({ currentCourts })),
    currentFacility: null,
    setCurrentFacility: (currentFacility) => set(() => ({ currentFacility })),
    currentUsers: [],
    setCurrentUsers: (currentUsers) => set(() => ({ currentUsers })),
    currentFirebaseUser: null,
    setCurrentFirebaseUser: (currentFirebaseUser) =>
      set(() => ({ currentFirebaseUser })),
    currentBookings: [],
    setCurrentBookings: (currentBookings) => set(() => ({ currentBookings })),
  }),
);
