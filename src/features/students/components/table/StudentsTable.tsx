import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from '@tabler/icons-react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/form/Button/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/navigation/DropdownMenu/dropdown-menu';
import { Label } from '@/components/ui/form/Label/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/display/Table/table';
import { Tabs, TabsContent } from '@/components/ui/navigation/Tabs/tabs';
import { StudentsColumns } from './StudentsColumns';
import { useStudentsStore } from '@/stores/studentsStore';
import { STUDENTS_LEVEL_OPTIONS } from '@/constants/studentsLevel';
import z from 'zod';
import { metaSchema, studentSchema } from '../../types/students';
import { CreateStudentDialog } from '../dialog/CreateStudentDialog';

export const StudentsTable = ({
  data,
  meta,
}: {
  data: z.infer<typeof studentSchema>[];
  meta: z.infer<typeof metaSchema>;
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const filters = useStudentsStore((state) => state.filters);
  const setFilters = useStudentsStore((state) => state.setFilters);

  const columns = StudentsColumns();
  const pageCount =
    meta?.total_pages ??
    (meta?.total_count
      ? Math.ceil(meta.total_count / (filters.perPage ?? 10))
      : 1);
  const VIEW_VALUE = 'students-table-view';
  const selectValue = (() => {
    if (!filters.school_stage || !filters.grade) return 'all';
    return `${filters.school_stage}-${filters.grade}`;
  })();

  const onSelectChange = (value: string) => {
    let newFilters;
    if (value === 'all') {
      newFilters = {
        ...filters,
        school_stage: undefined,
        grade: undefined,
        page: 1,
      };
    } else {
      const [school_stage, gradeString] = value.split('-');
      const grade = Number(gradeString);
      newFilters = {
        ...filters,
        school_stage,
        grade,
        page: 1,
      };
    }
    setFilters(newFilters);
    table.setPageIndex(0);
  };

  // setFiltersは描画後に更新する
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }));
  }, [pagination.pageIndex, pagination.pageSize, setFilters]);

  const table = useReactTable({
    data: data,
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
    manualPagination: true,
    pageCount,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      setPagination((prev) =>
        typeof updater === 'function' ? updater(prev) : updater
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // カラム表示のラベルを定義
  const columnLabelMap: Record<string, string> = {
    name: '名前',
    grade: '学年',
    status: '通塾状況',
    class_subjects: '受講科目',
    available_days: '授業曜日',
    joined_on: '入塾日',
  };

  return (
    <Tabs
      defaultValue={VIEW_VALUE}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/** セレクター */}
        <Select value={selectValue} onValueChange={onSelectChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">生徒一覧</SelectItem>
            {STUDENTS_LEVEL_OPTIONS.map((option) => (
              <SelectItem
                key={option.label}
                value={`${option.school_stage}-${option.grade}`}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/** カラムのカスタマイズとセクション追加ボタン */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
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
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
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
                      {columnLabelMap[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/** 生徒を追加するボタン */}
          <CreateStudentDialog />
        </div>
        {/** タブの内容 */}
      </div>
      <TabsContent
        value={VIEW_VALUE}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
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
                    data-state={row.getIsSelected() && 'selected'}
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
                    生徒が見つかりません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/** ページネーションと選択状態の表示 */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
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
                  {[10, 20].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
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
