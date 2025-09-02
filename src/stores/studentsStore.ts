import { create } from 'zustand';

type Filters = {
  searchKeyword?: string; // 例: 名前で検索するとき
  school_stage?: string; // 学校段階で絞り込み
  grade?: number; // 学年で絞り込み
  page: number; // ページ番号
  perPage: number; // 1ページあたりの件数
};

type StudentsState = {
  filters: Filters;
  setFilters: (
    patch: Partial<Filters> | ((prev: Filters) => Partial<Filters>)
  ) => void;
};

export const useStudentsStore = create<StudentsState>((set) => ({
  filters: { page: 1, perPage: 10 },
  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...(typeof patch === 'function' ? patch(state.filters) : patch),
      },
    })),
}));
