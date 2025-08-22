import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import { IconShieldStar, IconUsers } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/display/Badge/badge';
import { z } from 'zod';

import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';
import { useSignInStatus } from '@/hooks/useSignInStatus';

import { useTeachersStore } from '@/stores/teachersStore';
import { useEmploymentStatusTranslation } from '@/hooks/useEmploymentStatusTranslation';
import { DetailDrawer } from '../detail/DetailDrawer';
import { RawActions } from './RawActions';

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  employment_status: z.string(),
  class_subjects: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  studentsCount: z.number(),
  current_sign_in_at: z.string().nullable(),
});

// columns を関数として定義し、getDetailDrawerData を受け取る
export const createColumns = (): ColumnDef<z.infer<typeof schema>>[] => {
  const getTeacherData = useTeachersStore((state) => state.getTeacherData);
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center px-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        const detailData = getTeacherData(row.original.id);
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
      accessorKey: 'employment_status',
      header: '出勤状況',
      cell: ({ row }) => {
        const { createEmploymentStatusBadge } =
          useEmploymentStatusTranslation();
        return createEmploymentStatusBadge(row.original.employment_status);
      },
    },

    {
      accessorKey: 'class_subjects',
      header: '担当科目',
      cell: ({ row }) => {
        const { createIconTranslationBadge } = useSubjectTranslation();
        const subjects = row.original.class_subjects.map((cs) => (
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
      accessorKey: 'current_sign_in_at',
      header: '直近ログイン',
      cell: ({ row }) => {
        const { label, colorClass, Icon } = useSignInStatus(
          row.original.current_sign_in_at
        );
        return (
          <Badge variant="outline" className={`px-2 ${colorClass}`}>
            <Icon />
            {label}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <RawActions teacherId={row.original.id} />,
    },
  ];
};
