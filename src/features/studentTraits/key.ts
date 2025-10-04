// 一覧を取得するときに使う「検索条件」の型
export type StudentTraitSortByType =
  | "created_at_asc"
  | "created_at_desc"
  | "updated_at_asc"
  | "updated_at_desc";

export type StudentTraitListFilters = {
  student_id: number;
  searchKeyword?: string;
  sortBy?: StudentTraitSortByType;
  page?: number;
  perPage?: number;
};

const normalize = (filters: StudentTraitListFilters) => ({
  student_id: filters.student_id,
  searchKeyword: filters.searchKeyword ?? "",
  sortBy: filters.sortBy ?? undefined, // undefined の場合はソートしない
  page: filters.page ?? 1,
  perPage: filters.perPage ?? 10,
});

export const studentTraitKeys = {
  all: ["studentTraits"] as const, // ルート
  lists: () => [...studentTraitKeys.all, "list"] as const, // 一覧の親
  list: (filters: StudentTraitListFilters) =>
    [...studentTraitKeys.lists(), normalize(filters)] as const, // 条件付き一覧
  details: () => [...studentTraitKeys.all, "detail"] as const, // 詳細の親
  detail: (id: number) => [...studentTraitKeys.details(), id] as const, // 個別詳細
} as const;
