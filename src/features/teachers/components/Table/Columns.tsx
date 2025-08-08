import { Button } from '@/components/ui/form/Button/button';
import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/navigation/DropdownMenu/dropdown-menu';
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconShieldStar,
  IconUsers,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/display/Badge/badge';
import { z } from 'zod';
import { DetailDrawer } from './DetailDrawer';
import type { teacherDetailDrawer } from '../../hooks/useFomatTeachersData';
import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  employStatus: z.string(),
  classSubject: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  studentsCount: z.number(),
});

// columns を関数として定義し、getDetailDrawerData を受け取る
export const createColumns = (
  getDetailDrawerData: (id: number) => teacherDetailDrawer | undefined
): ColumnDef<z.infer<typeof schema>>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center px-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: '名前',
    cell: ({ row }) => {
      const detailData = getDetailDrawerData(row.original.id);
      return detailData ? (
        <DetailDrawer item={detailData} />
      ) : (
        <span>{row.original.name}</span>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: '役割',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.role === 'admin' ? (
            <IconShieldStar className="fill-blue-500" />
          ) : (
            <IconUsers className="fill-green-600" />
          )}
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'employStatus',
    header: '出勤状況',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {/** Employ Status で分岐する */}
        {row.original.employStatus === 'active' ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.employStatus}
      </Badge>
    ),
  },
  {
    accessorKey: 'classSubject',
    header: '担当科目',
    cell: ({ row }) => {
      const { createIconTranslationBadge } = useSubjectTranslation();
      const subjects = row.original.classSubject.map((cs) => (
        <span key={cs.id}>{createIconTranslationBadge(cs.name)}</span>
      ));
      return subjects;
    },
  },

  {
    accessorKey: 'studentsCount',
    header: '生徒数',
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2">
        {row.original.studentsCount} 名
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>編集</DropdownMenuItem>
          <DropdownMenuItem>コピーを作成</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">削除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
