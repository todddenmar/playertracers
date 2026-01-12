import { TFacility, TMembership, TSport, TUser } from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  currentSports: TSport[];
  currentFacilities: TFacility[];
  currentUser: TUser | null;
  currentMembers: TMembership[];
  currentFacility: TFacility | null;
};

export type TAppStoreActions = {
  setCurrentSports: (currentSports: TSport[]) => void;
  setCurrentFacilities: (currentFacilities: TFacility[]) => void;
  setCurrentUser: (currentUser: TUser | null) => void;
  setCurrentFacility: (currentFacility: TFacility | null) => void;
  setCurrentMembers: (currentMembers: TMembership[]) => void;
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
    currentFacility: null,
    setCurrentFacility: (currentFacility) => set(() => ({ currentFacility })),
  })
);
