import { create } from 'zustand';

interface CatalogFilterStore {
  navFilter: string | null;
  setNavFilter: (filter: string | null) => void;
  clearNavFilter: () => void;
}

export const useCatalogFilter = create<CatalogFilterStore>()((set) => ({
  navFilter: null,
  setNavFilter: (filter) => set({ navFilter: filter }),
  clearNavFilter: () => set({ navFilter: null }),
}));
