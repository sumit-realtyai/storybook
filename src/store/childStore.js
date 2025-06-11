import { create } from 'zustand';

const useChildStore = create((set) => ({
  childName: '',
  setChildName: (name) => set({ childName: name }),
}));

export default useChildStore;