import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { StudentTraitsRawActions } from "./StudentTraitsRawActions";
import { TraitHoverCard } from "@/features/studentTraits/components/hoverCard/TraitHoverCard";

import { formatIsoToDate } from "@/utils/formatIsoToDate";
import type { StudentTraitsColumnsProps } from "../../types/studentTraitTable";
import type { StudentTraitType } from "../../types/studentTraits";
import { TraitHoverBadge } from "../../utils/traitHoverBadge";

export const StudentTraitsColumns = ({
  studentId,
  isMobile,
}: StudentTraitsColumnsProps): ColumnDef<StudentTraitType>[] => {
  return [
    {
      id: "category",
      accessorFn: (row) => row.category,
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
            <TraitHoverCard
              trait={row.original}
              isMobile={isMobile}
              className="whitespace-nowrap"
            />
          </>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "categoryDisplay",
      header: "特性の種類",
      cell: ({ row }) => {
        const { TraitBadge } = TraitHoverBadge({
          category: row.original.category,
          isMobile,
        });

        return <div className="text-muted-foreground">{<TraitBadge />}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "作成日",
      cell: ({ row }) => {
        const createdAt = formatIsoToDate(row.original.created_at);
        return (
          <div className="text-muted-foreground px-1.5 mx-1">{createdAt}</div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "最終更新日",
      cell: ({ row }) => {
        const updatedAt =
          // Rails は created_at と updated_at が同じなので、単純比較で判定できる
          row.original.updated_at === row.original.created_at
            ? "---"
            : formatIsoToDate(row.original.updated_at);
        return (
          <div className="text-muted-foreground px-1.5 mx-1">{updatedAt}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <StudentTraitsRawActions
            studentTrait={row.original}
            studentId={studentId}
          />
        );
      },
    },
  ];
};
