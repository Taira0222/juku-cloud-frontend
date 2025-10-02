import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { LessonNotesRawActions } from "./LessonNotesRawActions";
import type { lessonNote } from "@/features/studentDashboard/type/studentDashboard";
import { columnsUtils } from "../../utils/columnsUtils";
import { LessonNoteDrawer } from "../drawer/LessonNoteDrawer";
import type { LessonNoteColumnsProps } from "../../types/lessonNoteTable";

export const LessonNotesColumns = ({
  isAdmin,
  subjects,
  studentId,
}: LessonNoteColumnsProps): ColumnDef<lessonNote>[] => {
  const { formatExpireDate, formatNoteType } = columnsUtils();
  return [
    {
      id: "subject",
      accessorFn: (row) => row.student_class_subject.class_subject.name,
      filterFn: (row, id, value: string) => row.getValue<string>(id) === value,
      header: () => null,
      cell: () => null,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "title",
      header: "タイトル",
      cell: ({ row }) => {
        return (
          <>
            <LessonNoteDrawer lessonNote={row.original} />
          </>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "expire_date",
      header: "有効期限",
      cell: ({ row }) => {
        const formatDate = formatExpireDate(row.original.expire_date);

        return <div className="text-muted-foreground">{formatDate}</div>;
      },
    },

    {
      accessorKey: "note_type",
      header: "分類",
      cell: ({ row }) => {
        const formatType = formatNoteType(row.original.note_type);
        return <div>{formatType}</div>;
      },
    },

    {
      accessorKey: "created_by_name",
      header: "作成者",
      cell: ({ row }) => {
        return <div>{row.original.created_by_name}</div>;
      },
    },
    {
      accessorKey: "last_updated_by_name",
      header: "最終更新者",
      cell: ({ row }) => {
        const lastUpdatedBy = row.original.last_updated_by_name
          ? row.original.last_updated_by_name
          : "---";
        return <div>{lastUpdatedBy}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <LessonNotesRawActions
            studentId={studentId}
            lessonNote={row.original}
            subjects={subjects}
            isAdmin={isAdmin}
          />
        );
      },
    },
  ];
};
