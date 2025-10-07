import { Button } from "@/components/ui/form/Button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/navigation/DropdownMenu/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

import { Link, useLocation } from "react-router-dom";
import type { StudentTraitsRawActionsProps } from "../../types/studentTraitTable";

export const StudentTraitsRawActions = ({
  studentId,
  studentTrait,
}: StudentTraitsRawActionsProps) => {
  const location = useLocation();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            id={`student-trait-actions-${studentTrait.id}`}
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link
              to={`/dashboard/${studentId}/student-traits/${studentTrait.id}/edit`}
              state={{ studentTrait, background: location }}
            >
              編集
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive">削除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
