import { create } from "zustand";

interface TrackSubwayState {
  subwayNumber: string;
  setSubwayNumber: (number: string) => void;
  resetSubwayNumber: () => void;
}

const useTrackSubwayStore = create<TrackSubwayState>()((set) => ({
  subwayNumber: "",
  setSubwayNumber: (number) => set({ subwayNumber: number }),
  resetSubwayNumber: () => set({ subwayNumber: "" }),
}));

export default useTrackSubwayStore;
