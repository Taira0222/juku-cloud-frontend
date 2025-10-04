import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/form/Button/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/navigation/DropdownMenu/dropdown-menu";
import { Label } from "@/components/ui/form/Label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/display/Table/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/navigation/Tabs/tabs";
import { LessonNotesColumns } from "./LessonNotesColumns";
import { resolveSubjectMeta } from "@/utils/subjectBadgeUtils";
import { HEADER_COLOR_BY_SUBJECT } from "../../constants/lessonNoteTable";
import type { subjectType } from "@/features/students/types/students";
import { CreateLessonNoteDialog } from "../dialog/CreateLessonNoteDialog";
import type { LessonNoteTableProps } from "../../types/lessonNoteTable";
import { useLessonNotesStore } from "@/stores/lessonNotesStore";

export const LessonNotesTable = ({
  studentId,
  subjects,
  lessonNotes,
  meta,
  isAdmin,
  isMobile,
}: LessonNoteTableProps) => {
  // 科目はDBでかならず1件以上登録されているので、サイズ0の可能性は考慮しない
  const defaultSubject = subjects[0];

  // タブの初期値を最初の科目に設定
  const [tabValue, setTabValue] = useState<string>(defaultSubject.name);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    subject: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const filters = useLessonNotesStore((state) => state.filters);
  const setFilters = useLessonNotesStore((state) => state.setFilters);

  const headerBGColor =
    HEADER_COLOR_BY_SUBJECT[tabValue as subjectType] ?? "bg-muted";

  const columns = LessonNotesColumns({ isAdmin, subjects, studentId });

  const pageCount =
    meta.total_pages ??
    (meta.total_count
      ? Math.ceil(meta.total_count / (filters.perPage ?? 10))
      : 1);

  const table = useReactTable({
    data: lessonNotes,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        // store も同時更新（副作用 useEffect 不要）
        setFilters((prevFilters) => ({
          ...prevFilters,
          page: next.pageIndex + 1,
          perPage: next.pageSize,
        }));
        return next;
      });
    },
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    if (tabValue) {
      // 科目フィルタ（React Table 内部）
      setColumnFilters([{ id: "subject", value: tabValue }]);

      // pageIndex を 0 にリセット
      if (table.getState().pagination.pageIndex !== 0) {
        table.setPageIndex(0);
      }

      const subjectId = subjects.find((s) => s.name === tabValue)?.id ?? 0;

      setFilters((prev) => ({
        ...prev,
        subject_id: subjectId,
        page: 1,
        perPage: 10,
      }));

      // ローカル pagination state も同期
      setPagination((prev) =>
        prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
      );
    }
  }, [tabValue, subjects, table, pagination.pageSize]);

  // カラム表示のラベルを定義
  const columnLabelMap: Record<string, string> = {
    expire_date: "有効期限",
    title: "タイトル",
    note_type: "分類",
    created_by_name: "作成者",
    last_updated_by_name: "最終更新者",
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={setTabValue}
      className="w-full flex-col justify-start gap-4"
    >
      <div className="flex items-center justify-between lg:px-6">
        {/** タブ */}
        <TabsList>
          {subjects.map((subject) => {
            const { label } = resolveSubjectMeta(subject.name);
            return (
              <TabsTrigger key={subject.id} value={subject.name}>
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/** カラムのカスタマイズとセクション追加ボタン */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            {!isMobile && (
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">
                    カラム表示のカスタマイズ
                  </span>
                  <span className="lg:hidden">カラムのカスタム</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
            )}

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    column.id !== "subject" &&
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnLabelMap[column.id]}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/** 科目ごとの引継ぎ事項を追加するボタン */}
          <CreateLessonNoteDialog subjects={subjects} studentId={studentId} />
        </div>
        {/** タブの内容 */}
      </div>
      <TabsContent
        value={tabValue}
        className="relative flex flex-col gap-4 overflow-auto lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className={`${headerBGColor} sticky top-0 z-10`}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    引継ぎ事項が見つかりません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/** ページネーションと選択状態の表示 */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                1ページに表示する行数
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">最初のページへ</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">前のページへ</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">次のページへ</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">最終ページへ</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
