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
import type { Student } from "../../types/students";
import { DeleteStudentDialog } from "../dialog/DeleteStudentDialog";
import { useState } from "react";

type Props = {
  student: Student;
};

export const StudentsRawActions = ({ student }: Props) => {
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            id={`student-actions-${student.id}`}
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link
              to={`/students/${student.id}/edit`}
              state={{ student: student, background: location }}
            >
              編集
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault(); // フォーカス移動によるチラつき防止
              setDialogOpen(true); // Dialog を開く
              setMenuOpen(false); // メニューを閉じる
            }}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Dropdownが閉じてしまってもDialogは空いたままにするために外側に出している */}
      <DeleteStudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={student}
      />
    </>
  );
};
