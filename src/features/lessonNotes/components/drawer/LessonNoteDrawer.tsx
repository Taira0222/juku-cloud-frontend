import { Button } from "@/components/ui/form/Button/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/layout/Drawer/drawer";
import { Label } from "@/components/ui/form/Label/label";
import { useIsMobile } from "@/hooks/useMobile";
import { IconX } from "@tabler/icons-react";
import type { lessonNote } from "@/features/studentDashboard/type/studentDashboard";
import { formatIsoToDate } from "@/utils/formatIsoToDate";

type Props = {
  lessonNote: Pick<
    lessonNote,
    | "title"
    | "description"
    | "expire_date"
    | "created_by_name"
    | "created_at"
    | "last_updated_by_name"
    | "updated_at"
  >;
};

export const LessonNoteDrawer = ({ lessonNote }: Props) => {
  const {
    title,
    description,
    expire_date,
    created_by_name,
    created_at,
    last_updated_by_name,
    updated_at,
  } = lessonNote;
  const isMobile = useIsMobile();
  const expireDate = formatIsoToDate(expire_date);

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="font-normal text-gray-600">
          {title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex justify-between items-center">
            <DrawerTitle>引継ぎ事項の詳細情報</DrawerTitle>
            <DrawerClose asChild>
              <Button autoFocus variant="ghost" aria-label="閉じる">
                <IconX className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            {description ? description : "詳細の説明は特にありません。"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expireDate">有効期限</Label>
            <p id="expireDate" className="text-muted-foreground">
              {expireDate}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="createdBy">作成者</Label>
            <p id="createdBy" className="text-muted-foreground">
              {created_by_name}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="createdAt">作成日</Label>
            <p id="createdAt" className="text-muted-foreground">
              {formatIsoToDate(created_at)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lastUpdatedBy">最終更新者</Label>
            <div id="lastUpdatedBy" className="text-muted-foreground">
              {last_updated_by_name ? last_updated_by_name : "---"}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastUpdatedAt">最終更新日</Label>
            <p id="lastUpdatedAt" className="text-muted-foreground">
              {created_at === updated_at ? "---" : formatIsoToDate(updated_at)}
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
