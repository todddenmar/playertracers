import { TFacility, TSport } from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  currentSports: TSport[];
  currentFacilities: TFacility[];
};

export type TAppStoreActions = {
  setCurrentSports: (currentSports: TSport[]) => void;
  setCurrentFacilities: (currentFacilities: TFacility[]) => void;
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
  })
);
