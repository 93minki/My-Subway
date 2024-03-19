import { create } from "zustand";

interface TrackSubwayState {
  subwayNumber: string;
  setSubwayNumber: (number: string) => void;
}

const useTrackSubwayStore = create<TrackSubwayState>()((set) => ({
  subwayNumber: "",
  setSubwayNumber: (number) => set({ subwayNumber: number }),
}));

export default useTrackSubwayStore;
