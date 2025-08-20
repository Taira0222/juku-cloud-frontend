import { Button } from '@/components/ui/form/Button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/navigation/DropdownMenu/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { DeleteTeacherDialog } from './DeleteTeacherDialog';
import { useTeachersStore } from '@/stores/teachersStore';

type Props = {
  teacherId: number;
};

export const RawActions = ({ teacherId }: Props) => {
  const [open, setOpen] = useState(false);
  const getTeacherData = useTeachersStore((state) => state.getTeacherData);
  const teacher = getTeacherData(teacherId);
  return (
    <>
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
          {teacher?.role !== 'admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault(); // フォーカス移動によるチラつき防止
                  setOpen(true); // Dialog を開く
                }}
              >
                削除
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTeacherDialog
        open={open}
        onOpenChange={setOpen}
        teacherId={teacherId}
      />
    </>
  );
};
