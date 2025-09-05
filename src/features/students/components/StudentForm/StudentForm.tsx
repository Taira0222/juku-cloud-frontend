import { useMemo, useState, useEffect } from 'react';
import type { StudentFormProps } from '../../types/studentForm';
import { createStudentFormHandlers } from '../../utils/studentFormHandlers';
import { buildTeachersByTab } from '../../utils/studentFormDerived';
import { ALL_DAY_IDS, shortDayLabel } from '../../constants/studentForm';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/navigation/Tabs/tabs';
import { DAY_OF_WEEK_WITH_ID } from '@/constants/dayOfWeekTranslations';

import { cn } from '@/lib/utils';

import NameField from './parts/NameField';
import LevelSelect from './parts/LevelSelect';
import DesiredSchoolField from './parts/DesiredSchoolField';
import JoinedOnPicker from './parts/JoinedOnPicker';
import StatusSelect from './parts/StatusSelect';
import SubjectCheckboxes from './parts/SubjectCheckboxes';
import DayCheckboxes from './parts/DayCheckboxes';
import TeacherAssignmentTabs from './parts/TeacherAssignmentTabs';
import SelectedAssignmentsBadges from './parts/SelectedAssignmentsBadges';
import { Button } from '@/components/ui/form/Button/button';

export default function StudentForm({
  mode,
  value,
  onChange,
  onSubmit,
  loading,
  teachers,
}: StudentFormProps) {
  // フォーム操作ハンドラ
  const H = createStudentFormHandlers(onChange);

  // すでに選択された科目・曜日
  const selectedSubjectIds = value.subject_ids ?? [];
  const selectedDayIds = value.available_day_ids ?? [];

  // 講師リスト(すべて・曜日ごと)をタブ表示用に変換
  const teachersByTab = useMemo(
    () =>
      buildTeachersByTab(
        teachers,
        selectedSubjectIds,
        selectedDayIds,
        ALL_DAY_IDS
      ),
    [teachers, selectedSubjectIds, selectedDayIds]
  );

  // タブ自動選択
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    if (
      selectedDayIds.length > 0 &&
      selectedSubjectIds.length > 0 &&
      activeTab === null
    ) {
      // 選択した曜日のうち、最初の曜日をアクティブにする
      setActiveTab(String(selectedDayIds[0]));
    }
    if (selectedDayIds.length === 0 || selectedSubjectIds.length === 0) {
      // 科目または曜日が未選択ならタブを非アクティブにする
      setActiveTab(null);
    }
  }, [selectedDayIds, selectedSubjectIds, activeTab]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="px-4 sm:px-6 py-6 space-y-5"
    >
      <div className="space-y-4">
        <NameField value={value} onChange={H.handleInputChange} />

        <LevelSelect value={value} onChange={H.handleStudentOptionChange} />

        <DesiredSchoolField value={value} onChange={H.handleInputChange} />

        <JoinedOnPicker
          value={value}
          onChange={H.handleSelectChange('joined_on')}
        />

        <StatusSelect value={value} onChange={H.handleSelectChange('status')} />

        <SubjectCheckboxes
          value={value}
          toggle={(id: number) => H.toggleInArray('subject_ids', id)}
        />

        <DayCheckboxes
          value={value}
          toggle={(id: number) => H.toggleInArray('available_day_ids', id)}
        />

        {/* 担当講師 */}
        {activeTab === null ? (
          <div className="rounded-md border p-3 text-center space-y-1.5">
            <p className="text-sm font-medium">
              受講科目と受講可能曜日を選ぶと、担当できる講師が表示されます
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium">担当講師を選択</div>
            <span className="text-muted-foreground text-sm">
              科目と曜日で絞り込みされています。
            </span>

            <Tabs
              value={activeTab ?? undefined}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex flex-wrap">
                {selectedDayIds
                  .sort((a, b) => a - b)
                  .map((id) => {
                    const label =
                      DAY_OF_WEEK_WITH_ID.find((day) => day.id === id)?.name ??
                      '？';
                    return (
                      <TabsTrigger key={id} value={String(id)}>
                        {shortDayLabel(label)}
                      </TabsTrigger>
                    );
                  })}
              </TabsList>

              {selectedDayIds
                .sort((a, b) => a - b)
                .map((dayId) => (
                  <TabsContent
                    key={dayId}
                    value={String(dayId)}
                    className="mt-3"
                  >
                    <div
                      className={cn(
                        'overflow-y-auto rounded-md border p-3 space-y-2',
                        'max-h-60'
                      )}
                    >
                      <TeacherAssignmentTabs
                        dayId={dayId}
                        teachers={teachersByTab.byDay[dayId] ?? []}
                        selectedSubjectIds={selectedSubjectIds}
                        assigned={value.assignments}
                        toggle={H.toggleAssignmentInForm}
                      />
                    </div>
                  </TabsContent>
                ))}
            </Tabs>

            <SelectedAssignmentsBadges
              assignments={value.assignments}
              teachers={teachers}
              untoggle={H.toggleAssignmentInForm}
            />
          </div>
        )}
      </div>

      <div className="mt-6 gap-2 sm:justify-between">
        <Button type="submit" disabled={loading}>
          {mode === 'edit' ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  );
}
