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

import type { LessonNoteRawActionsProps } from "../../types/lessonNoteTable";

export const LessonNotesRawActions = ({
  studentId,
  lessonNote,
  subjects,
  isAdmin,
}: LessonNoteRawActionsProps) => {
  const location = useLocation();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            id={`lesson-note-actions-${lessonNote.id}`}
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link
              to={`/dashboard/${studentId}/lesson-notes/${lessonNote.id}/edit`}
              state={{
                lessonNote: lessonNote,
                subjects: subjects,
                background: location,
              }}
            >
              編集
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">削除</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
