import { Button } from '@/components/ui/form/Button/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/layout/Drawer/drawer';
import { Label } from '@/components/ui/form/Label/label';
import type { teacherDetailDrawer } from '../../hooks/useFomatTeachersData';
import { useIsMobile } from '@/hooks/useMobile';
import { Badge } from '@/components/ui/display/Badge/badge';
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react';
import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';
import { useDayOfWeekTranslation } from '@/hooks/useDayOfWeekTranslation';
import { Fragment } from 'react/jsx-runtime';

export const DetailDrawer = ({ item }: { item: teacherDetailDrawer }) => {
  const isMobile = useIsMobile();
  const { createIconTranslationBadge } = useSubjectTranslation();
  const { translate } = useDayOfWeekTranslation();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>講師の詳細情報</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">名前</Label>
            <p id="name" className="text-muted-foreground">
              {item.name}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">メール</Label>
            <p id="email" className="text-muted-foreground">
              {item.email}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">役割</Label>
            <p id="role" className="text-muted-foreground">
              {item.role}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="employStatus">出勤状況</Label>
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 gap-1"
            >
              {item.employStatus === 'active' ? (
                <IconCircleCheckFilled className="h-4 w-4 fill-green-500 dark:fill-green-400" />
              ) : (
                <IconLoader className="h-4 w-4" />
              )}
              {item.employStatus}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subjects">担当科目</Label>
            <div id="subjects" className="flex flex-wrap gap-2">
              {item.classSubject.map((cs) => (
                <Fragment key={cs.id}>
                  {createIconTranslationBadge(cs.name)}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="studentList">担当生徒</Label>
            <p id="studentList" className="text-muted-foreground">
              {item.Students.map((s) => s.name).join(', ')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastLogin">最終ログイン</Label>
            <p id="lastLogin" className="text-muted-foreground">
              {item.last_sign_in_at}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentLogin">現在のログイン状況</Label>
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 gap-1"
            >
              {item.current_sign_in_at !== null ? (
                <>
                  <IconCircleCheckFilled className="h-4 w-4 fill-green-500 dark:fill-green-400" />
                  <span>ログイン中</span>
                </>
              ) : (
                <>
                  <IconLoader className="h-4 w-4" />
                  <span>未ログイン</span>
                </>
              )}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="availableDays">勤務可能日</Label>
            <p id="availableDays" className="text-muted-foreground">
              {item.available_days.map((day) => translate(day.name)).join(', ')}
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
