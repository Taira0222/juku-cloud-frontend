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
import type { teacherDetailDrawer } from '../../hooks/Table/useFomatTeachersData';
import { useIsMobile } from '@/hooks/useMobile';
import { Badge } from '@/components/ui/display/Badge/badge';
import {
  IconCircle,
  IconCircleCheckFilled,
  IconLoader,
  IconX,
} from '@tabler/icons-react';
import { useSubjectTranslation } from '@/hooks/useSubjectTranslation';
import { useDayOfWeekTranslation } from '@/hooks/useDayOfWeekTranslation';
import { Fragment } from 'react/jsx-runtime';
import { useLastSignInStatus } from '@/hooks/useLastSignInStatus';

export const DetailDrawer = ({ item }: { item: teacherDetailDrawer }) => {
  const isMobile = useIsMobile();
  const { createIconTranslationBadge } = useSubjectTranslation();
  const { translate } = useDayOfWeekTranslation();
  const { label, colorClass, Icon } = useLastSignInStatus(item.last_sign_in_at);

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
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 gap-1"
            >
              {item.employment_status === 'active' ? (
                <IconCircleCheckFilled className="h-4 w-4 fill-green-500 dark:fill-green-400" />
              ) : (
                <IconLoader className="h-4 w-4" />
              )}
              {item.employment_status}
            </Badge>
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
              {item.available_days.map((day) => translate(day.name)).join(', ')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="studentList">担当生徒</Label>
            {item.students.map((s) => {
              const assignment = item.teaching_assignments.find(
                (ta) => ta.student_id === s.id
              );
              const statusLabel =
                assignment?.teaching_status === true
                  ? '指導中'
                  : assignment?.teaching_status === false
                  ? '指導停止'
                  : '';
              const statusColor =
                assignment?.teaching_status === true
                  ? 'text-green-500'
                  : 'text-red-500';
              const statusIcon =
                assignment?.teaching_status === true ? (
                  <IconCircleCheckFilled className={`h-4 w-4 ${statusColor}`} />
                ) : (
                  <IconLoader className={`h-4 w-4 ${statusColor}`} />
                );
              return (
                <div key={s.id} className="flex gap-1">
                  {s.name}
                  {statusLabel && (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground px-1.5 gap-1"
                    >
                      {statusIcon}
                      {statusLabel}
                    </Badge>
                  )}
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
            <Label htmlFor="lastLogin">最終ログイン</Label>
            <Badge variant="outline" className={`px-2 ${colorClass}`}>
              <Icon />
              {label}
            </Badge>
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
                  <IconCircle className="h-4 w-4" />
                  <span>未ログイン</span>
                </>
              )}
            </Badge>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
