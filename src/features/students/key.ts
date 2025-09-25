// 一覧を取得するときに使う「検索条件」の型
export type StudentListFilters = {
  searchKeyword?: string; // 例: 名前で検索するとき
  school_stage?: string; // 学校段階で絞り込み
  grade?: number; // 学年で絞り込み
  page?: number; // ページ番号
  perPage?: number; // 1ページあたりの件数
};

// filters を「常に同じ形の文字列」に変換する関数
// 省略時のデフォルトを埋める（＝意味の同一化）
const normalize = (filters: StudentListFilters = {}) => ({
  searchKeyword: filters.searchKeyword ?? "",
  school_stage: filters.school_stage ?? "",
  grade: filters.grade ?? null,
  page: filters.page ?? 1,
  perPage: filters.perPage ?? 10,
});

export const studentKeys = {
  all: ["students"] as const, // ルート
  lists: () => [...studentKeys.all, "list"] as const, // 一覧の親
  list: (filters: StudentListFilters) =>
    [...studentKeys.lists(), normalize(filters)] as const, // 条件付き一覧
  details: () => [...studentKeys.all, "detail"] as const, // 詳細の親
  detail: (id: number) => [...studentKeys.details(), id] as const, // 個別詳細
} as const;
