import { create } from "zustand";

interface SubscriptionInfoState {
  subscriptionInfo: PushSubscription | null;
  setSubscriptionInfo: (info: PushSubscription) => void;
}

const useSubscriptionInfoStore = create<SubscriptionInfoState>()((set) => ({
  subscriptionInfo: null,
  setSubscriptionInfo: (info) => set({ subscriptionInfo: info }),
}));

export default useSubscriptionInfoStore;
