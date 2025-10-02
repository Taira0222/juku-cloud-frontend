// 一覧を取得するときに使う「検索条件」の型
export type LessonNoteSortByType = "expire_date_asc" | "expire_date_desc";

export type LessonNoteListFilters = {
  studentId: number;
  searchKeyword?: string;
  sortBy?: LessonNoteSortByType;
  page?: number;
  perPage?: number;
};

const normalize = (filters: LessonNoteListFilters) => ({
  studentId: filters.studentId,
  searchKeyword: filters.searchKeyword ?? "",
  sortBy: filters.sortBy ?? undefined, // undefined の場合はソートしない
  page: filters.page ?? 1,
  perPage: filters.perPage ?? 10,
});

export const lessonNoteKeys = {
  all: ["lessonNotes"] as const, // ルート
  lists: () => [...lessonNoteKeys.all, "list"] as const, // 一覧の親
  list: (filters: LessonNoteListFilters) =>
    [...lessonNoteKeys.lists(), normalize(filters)] as const, // 条件付き一覧
  details: () => [...lessonNoteKeys.all, "detail"] as const, // 詳細の親
  detail: (id: number) => [...lessonNoteKeys.details(), id] as const, // 個別詳細
} as const;
