import { Button } from '@/components/ui/form/Button/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/layout/Drawer/drawer';
import { Label } from '@/components/ui/form/Label/label';

import { useIsMobile } from '@/hooks/useMobile';
import { Badge } from '@/components/ui/display/Badge/badge';
import { IconX } from '@tabler/icons-react';
import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';

import { Fragment } from 'react/jsx-runtime';
import { useSignInStatus } from '@/hooks/useSignInStatus';
import { useSchoolStageTranslation } from '@/hooks/useSchoolStageTranslations';
import type { teacherDetailDrawer } from '../../types/teachers';

import { formatDayOfWeek } from '@/utils/formatDayOfWeek';
import { useStatusTranslation } from '@/hooks/useStatusTranslation';

export const DetailDrawer = ({ item }: { item: teacherDetailDrawer }) => {
  const isMobile = useIsMobile();
  const { createIconTranslationBadge } = useSubjectTranslation();
  const { createStatusBadge } = useStatusTranslation();
  const { translateSchoolStage } = useSchoolStageTranslation();
  const { label, colorClass, Icon } = useSignInStatus(item.current_sign_in_at);

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex justify-between items-center">
            <DrawerTitle>講師の詳細情報</DrawerTitle>
            <DrawerClose asChild>
              <Button autoFocus variant="ghost" aria-label="閉じる">
                <IconX className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            講師のプロフィールや担当情報を表示します。
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">名前</Label>
            <p id="name" className="text-muted-foreground">
              {item.name}
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
            {createStatusBadge(item.employment_status, item.role)}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subjects">担当科目</Label>
            <div id="subjects" className="flex flex-wrap gap-2">
              {item.class_subjects.map((cs) => (
                <Fragment key={cs.id}>
                  {createIconTranslationBadge(cs.name)}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="availableDays">勤務可能日</Label>
            <p id="availableDays" className="text-muted-foreground">
              {item.available_days
                .map((day) => formatDayOfWeek(day.name))
                .join(', ')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="studentList">担当生徒</Label>
            {item.students.map((s) => {
              const schoolStage = translateSchoolStage(s.school_stage);
              return (
                <div key={s.id} className="flex gap-1">
                  {s.name}: {schoolStage}
                  {s.grade}年生
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">メール</Label>
            <p id="email" className="text-muted-foreground">
              {item.email}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastLogin">直近ログイン</Label>
            <Badge variant="outline" className={`px-2 ${colorClass}`}>
              <Icon />
              {label}
            </Badge>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
