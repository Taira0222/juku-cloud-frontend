import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';
import { StudentsRawActions } from './StudentsRawActions';
import type { studentSchema } from '../../types/students';
import { Link } from 'react-router-dom';
import { useFormatGrade } from '@/hooks/useFormatGrade';
import { useStatusTranslation } from '@/hooks/useStatusTranslation';
import { useDayOfWeekTranslation } from '@/hooks/useDayOfWeekTranslation';
import { useIsoToDate } from '@/hooks/useIsoToDate';

// columns を関数として定義し、getDetailDrawerData を受け取る
export const StudentsColumns = (): ColumnDef<
  z.infer<typeof studentSchema>
>[] => {
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
        return (
          <Link to={`/dashboard/${row.original.id}`}>{row.original.name}</Link>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: 'grade',
      header: '学年',
      cell: ({ row }) => {
        const formatGrade = useFormatGrade(
          row.original.school_stage,
          row.original.grade
        );
        return <div>{formatGrade}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: '通塾状況',
      cell: ({ row }) => {
        const { createStatusBadge } = useStatusTranslation();
        return createStatusBadge(row.original.status, 'student');
      },
    },

    {
      accessorKey: 'class_subjects',
      header: '受講科目',
      cell: ({ row }) => {
        const { createIconTranslationBadge } = useSubjectTranslation();
        const subjects = row.original.class_subjects.map((cs) => (
          <span key={cs.id}>{createIconTranslationBadge(cs.name)}</span>
        ));
        return subjects;
      },
    },
    {
      accessorKey: 'available_days',
      header: '授業曜日',
      cell: ({ row }) => {
        const { translateDayOfWeek } = useDayOfWeekTranslation();
        return (
          <div className="text-muted-foreground">
            {row.original.available_days
              .map((day) => translateDayOfWeek(day.name))
              .join(', ')}
          </div>
        );
      },
    },
    {
      accessorKey: 'joined_on',
      header: '入塾日',
      cell: ({ row }) => {
        const joinedOn = useIsoToDate(row.original.joined_on);
        return <div className="text-muted-foreground">{joinedOn}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <StudentsRawActions studentId={row.original.id} />,
    },
  ];
};
