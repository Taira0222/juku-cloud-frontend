import { create } from 'zustand';

type Filters = {
  searchKeyword?: string; // 例: 名前で検索するとき
  school_stage?: string; // 学校段階で絞り込み
  grade?: number; // 学年で絞り込み
  page: number; // ページ番号
  perPage: number; // 1ページあたりの件数
};

type StudentState = {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
};

export const useStudentsStore = create<StudentState>((set) => ({
  filters: {
    page: 1,
    perPage: 10,
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
