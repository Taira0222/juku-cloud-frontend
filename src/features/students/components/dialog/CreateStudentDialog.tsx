import { Badge } from '@/components/ui/display/Badge/badge';
import { Button } from '@/components/ui/form/Button/button';
import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import { Input } from '@/components/ui/form/Input/input';
import { Label } from '@/components/ui/form/Label/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/navigation/Dialog/dialog';
import { STUDENTS_LEVEL_OPTIONS } from '@/constants/studentsLevel';
import { STUDENT_STATUS_TRANSLATIONS } from '@/constants/studentStatusTranslations';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';
import { IconPlus } from '@tabler/icons-react';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import z from 'zod';
import {
  availableDaysSchema,
  classSubjectsSchema,
  studentSchema,
  teachersSchema,
} from '../../types/students';
import { DAY_OF_WEEK_WITH_ID } from '@/constants/dayOfWeekTranslations';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { useTeachersStore } from '@/stores/teachersStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/navigation/Tabs/tabs';
import { useFetchTeachers } from '@/features/teachers/queries/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/useFormatTeachersData';
import SpinnerWithText from '@/components/common/status/Loading';
import { Calendar } from '@/components/ui/form/Calendar/calendar';
import { ChevronDownIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

type Teacher = {
  id: number;
  name: string;
  teachable_subjects: { id: number; name: string }[];
  workable_days: { id: number; name: string }[];
};

// toggleInArray を使用するkey の型
type ToggleableKeys = 'subjects' | 'available_days' | 'teachers';

type Draft = {
  name: string;
  status: string;
  school_stage: string;
  grade: number | null;
  desired_school: string;
  joined_on: string | null;
  subjects: Array<z.infer<typeof classSubjectsSchema>>;
  available_days: Array<z.infer<typeof availableDaysSchema>>;
  teachers: Array<z.infer<typeof teachersSchema>>;
};

export const CreateStudentDialog = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const detailDrawer = useTeachersStore((state) => state.detailDrawer);
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const initialFormData: Draft = {
    name: '',
    school_stage: '',
    grade: null,
    status: '',
    desired_school: '',
    joined_on: null,
    subjects: [],
    available_days: [],
    teachers: [],
  };
  const [formData, setFormData] = useState<Draft>(initialFormData);
  // 選択済みの科目/曜日
  const selectedSubjects = formData.subjects ?? [];
  const selectedDays = formData.available_days ?? [];

  // ストアが空 & ダイアログが開いている → 取ってくる
  const isStoreEmpty = (detailDrawer?.length ?? 0) === 0;
  const needFetch = isStoreEmpty && open;

  const { loading, error, currentUserData, teachersData } =
    useFetchTeachers(needFetch);

  useFormatTeachersData(
    currentUserData,
    teachersData,
    needFetch && !!teachersData
  );

  // detailDrawer を取り出して Teacher の型に当てはめる
  const teachers: Teacher[] = detailDrawer.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    teachable_subjects: teacher.class_subjects,
    workable_days: teacher.available_days,
  }));

  // 科目IDと曜日IDの集合（高速化）
  const subjectIdSet = new Set(selectedSubjects.map((subject) => subject.id));
  const dayIdSet = new Set(selectedDays.map((day) => day.id));

  // 「選択中の（科目∧曜日）にマッチする講師」判定
  const matchesCurrentFilters = (teacher: Teacher) => {
    const subjectOK =
      subjectIdSet.size === 0 ||
      teacher.teachable_subjects?.some((subject) =>
        subjectIdSet.has(subject.id)
      );
    const dayOK =
      dayIdSet.size === 0 ||
      teacher.workable_days?.some((day) => dayIdSet.has(day.id));
    return subjectOK && dayOK;
  };

  // タブごとの講師リスト（All と 科目別）
  const teachersByTab = useMemo(() => {
    // All タブ: 現在の科目・曜日の両方を使って絞り込み
    const all = teachers.filter(matchesCurrentFilters);

    // 科目ごと: その科目 +（曜日条件は維持）
    const bySubject: Record<string, Teacher[]> = {};
    for (const subject of selectedSubjects) {
      bySubject[String(subject.id)] = teachers.filter((teacher) => {
        const hasThisSubject = teacher.teachable_subjects?.some(
          (teacher_subject) => teacher_subject.id === subject.id
        );
        const dayOK =
          dayIdSet.size === 0 ||
          teacher.workable_days?.some((day) => dayIdSet.has(day.id));
        return hasThisSubject && dayOK;
      });
    }
    return { all, bySubject };
  }, [teachers, selectedSubjects, dayIdSet]);

  const dateToISO = (date: Date) => {
    // ローカルずれ回避のため、手動で YYYY-MM-DD を作成
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isoToDate = (iso?: string | null) => {
    if (!iso) return undefined;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1); // ローカル日付として生成
  };

  const selectedJoinedOn = isoToDate(formData.joined_on);

  const levelValue =
    formData.school_stage != null && typeof formData.grade === 'number'
      ? `${formData.school_stage}-${formData.grade}`
      : '';

  // 名前の変更
  const handleInputChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  // セレクターの変更
  const handleSelectChange =
    <T,>(field: keyof typeof formData) =>
    (value: T) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  // 学年を成形して保存
  const handleStudentOptionChange = (value: string) => {
    if (value === '') {
      setFormData((prev) => ({ ...prev, school_stage: '', grade: null }));
      return;
    }
    const [stage, grade] = value.split('-');
    setFormData((prev) => ({
      ...prev,
      school_stage: stage,
      grade: Number(grade),
    }));
  };

  // 表示用
  const joinedOnLabel = selectedJoinedOn
    ? new Intl.DateTimeFormat('ja-JP').format(selectedJoinedOn)
    : '日付を選択';

  // 配列の中で値をトグルする関数（追加・削除）
  const toggleValueById = (
    list: { id: number; name: string }[],
    v: { id: number; name: string }
  ) => {
    if (list.some((item) => item.id === v.id)) {
      return list.filter((item) => item.id !== v.id);
    } else {
      return [...list, v];
    }
  };

  const toggleInArray = (
    key: ToggleableKeys,
    value: { id: number; name: string }
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: toggleValueById(prev[key] ?? [], value),
    }));
  };
  // ダイアログを閉じたらフォームを初期化
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 余分な空白を削除して null に変換
    const payload = {
      ...formData,
      desired_school:
        formData.desired_school && formData.desired_school.trim() !== ''
          ? formData.desired_school.trim()
          : null,
    };
    const parsed = studentSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues.map((issue) => issue.message).join('\n'));
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">生徒の追加</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'sm:max-w-lg overflow-y-auto',
          isMobile
            ? 'top-12 translate-y-0 max-h-[85dvh]' // モバイル: 上寄せ + 本体スクロール
            : 'top-1/2 -translate-y-1/2 max-h-[90dvh]' // デスクトップ: 中央寄せ
        )}
      >
        <DialogHeader>
          <DialogTitle>生徒を新規作成</DialogTitle>
          <DialogDescription>
            生徒の基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>講師情報を読み込み中...</SpinnerWithText>
          </div>
        )}
        {!loading && error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 py-6 space-y-5"
            >
              <div className="space-y-4">
                {/* 名前：Input */}
                <div className="space-y-2">
                  <Label htmlFor="studentName">生徒の名前</Label>
                  <Input
                    id="studentName"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="生徒の名前を入力してください"
                    required
                  />
                </div>

                {/* 学年の選択：Select */}
                <div className="space-y-1">
                  <Label htmlFor="selectLevel">学年を選択</Label>
                  <Select
                    value={levelValue}
                    onValueChange={handleStudentOptionChange}
                  >
                    <SelectTrigger id="selectLevel">
                      <SelectValue placeholder="学年を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDENTS_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem
                          key={`${opt.school_stage}-${opt.grade}`}
                          value={`${opt.school_stage}-${opt.grade}`}
                          id={`${opt.school_stage}-${opt.grade}`}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 志望校：Input */}
                <div className="space-y-2">
                  <Label htmlFor="desiredSchool">志望校</Label>
                  <Input
                    id="desiredSchool"
                    value={formData.desired_school}
                    onChange={handleInputChange('desired_school')}
                    placeholder="志望校を入力してください"
                  />
                </div>

                {/* 入塾日：Input type=date */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      入塾日
                    </Label>
                    <Popover
                      modal={true}
                      open={calendarOpen}
                      onOpenChange={setCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {joinedOnLabel}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-50 w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={selectedJoinedOn}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return;
                            handleSelectChange('joined_on')(dateToISO(date));
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* 通塾状況：Select */}
                <div className="space-y-2">
                  <Label htmlFor="status">通塾状況</Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleSelectChange('status')}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STUDENT_STATUS_TRANSLATIONS).map(
                        ([key, { name }]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* 担当科目：複数チェック */}
                <div className="space-y-2">
                  <Label>担当科目（複数可）</Label>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    {/** 複数選択可能な担当科目のチェックボックス */}
                    {Object.entries(SUBJECT_TRANSLATIONS).map(
                      ([key, { id, name }]) => {
                        const checkboxId = `subject-checkbox-${key}`;
                        return (
                          <div key={key} className="flex items-center gap-2 ">
                            <Checkbox
                              id={checkboxId}
                              checked={selectedSubjects.some(
                                (subject) =>
                                  subject.id === id && subject.name === key
                              )}
                              onCheckedChange={() =>
                                toggleInArray('subjects', {
                                  id,
                                  name: key,
                                })
                              }
                            />
                            <Label
                              htmlFor={checkboxId}
                              className="font-normal text-base"
                            >
                              {name}
                            </Label>
                          </div>
                        );
                      }
                    )}
                  </div>
                  {/** 選択された担当科目を表示するバッジ */}
                  {selectedSubjects.length > 0 && (
                    <section
                      aria-label="選択中の担当科目"
                      className="flex flex-wrap gap-2 pt-1"
                    >
                      {selectedSubjects.map(({ id, name }) => {
                        const subjectMeta = SUBJECT_TRANSLATIONS[name];
                        const label = subjectMeta?.name ?? name;
                        const Icon = subjectMeta?.icon;
                        const color = subjectMeta?.color ?? 'gray';

                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className={`cursor-pointer text-muted-foreground inline-flex items-center gap-1 ${color}`}
                            onClick={() =>
                              toggleInArray('subjects', { id, name })
                            }
                            aria-label={`${label} を削除`}
                          >
                            {Icon && (
                              <Icon
                                aria-hidden="true"
                                className="inline-block"
                              />
                            )}
                            <span>{label}</span>
                            <span aria-hidden="true">✕</span>
                          </Badge>
                        );
                      })}
                    </section>
                  )}
                </div>

                {/* 担当可能曜日：複数チェック */}
                <div className="space-y-2">
                  <Label>担当可能曜日（複数可）</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAY_OF_WEEK_WITH_ID.map(({ id, key, name }) => {
                      const checkboxId = `day-checkbox-${id}`;
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <Checkbox
                            id={checkboxId}
                            checked={formData.available_days?.some(
                              (days) => days.id === id && days.name === key
                            )}
                            onCheckedChange={() =>
                              toggleInArray('available_days', {
                                id,
                                name: key,
                              })
                            }
                            aria-label={name}
                          />
                          <Label
                            htmlFor={checkboxId}
                            className="font-normal text-base"
                          >
                            {name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 講師選択（科目タブ連動） */}
                <div className="space-y-2">
                  <Label>講師を選択</Label>
                  <span className="text-muted-foreground text-sm">
                    科目と曜日で絞り込みされています。
                  </span>
                  <Tabs defaultValue="all" className="w-full">
                    {/* タブ見出し */}
                    <TabsList className="flex flex-wrap">
                      <TabsTrigger value="all">すべて</TabsTrigger>
                      {selectedSubjects.map(({ id, name }) => {
                        const meta = SUBJECT_TRANSLATIONS[name];
                        const label = meta?.name ?? name;
                        return (
                          <TabsTrigger key={id} value={String(id)}>
                            {label}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {/* All タブ内容 */}
                    <TabsContent value="all" className="mt-3">
                      <div className="max-h-60 overflow-y-auto rounded-md border p-3 space-y-2">
                        {teachersByTab.all.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            該当する講師がいません
                          </p>
                        )}

                        {teachersByTab.all.map((teacher) => {
                          const checked = formData.teachers?.some(
                            (x) => x.id === teacher.id
                          );
                          const checkboxId = `teacher-all-${teacher.id}`;
                          return (
                            <div
                              key={teacher.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={checkboxId}
                                checked={!!checked}
                                onCheckedChange={() =>
                                  toggleInArray('teachers', {
                                    id: teacher.id,
                                    name: teacher.name,
                                  })
                                }
                                aria-label={teacher.name}
                              />
                              <Label
                                htmlFor={checkboxId}
                                className="font-normal text-base"
                              >
                                {teacher.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    {/* 科目別タブ内容 */}
                    {selectedSubjects.map(({ id, name }) => {
                      const subjectTeachers =
                        teachersByTab.bySubject[String(id)] ?? [];
                      const meta = SUBJECT_TRANSLATIONS[name];
                      const label = meta?.name ?? name;

                      return (
                        <TabsContent
                          key={id}
                          value={String(id)}
                          className="mt-3"
                        >
                          <div className="max-h-60 overflow-y-auto rounded-md border p-3 space-y-2">
                            {subjectTeachers.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                「{label}」に対応する講師がいません
                              </p>
                            )}

                            {subjectTeachers.map((t) => {
                              const checked = formData.teachers?.some(
                                (x) => x.id === t.id
                              );
                              const checkboxId = `teacher-${id}-${t.id}`;
                              return (
                                <div
                                  key={t.id}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    id={checkboxId}
                                    checked={!!checked}
                                    onCheckedChange={() =>
                                      toggleInArray('teachers', {
                                        id: t.id,
                                        name: t.name,
                                      })
                                    }
                                    aria-label={t.name}
                                  />
                                  <Label
                                    htmlFor={checkboxId}
                                    className="font-normal text-base"
                                  >
                                    {t.name}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>

                  {/* 選択中の講師バッジ（クリックで解除） */}
                  {formData.teachers && formData.teachers.length > 0 && (
                    <section
                      aria-label="選択中の講師"
                      className="flex flex-wrap gap-2 pt-1"
                    >
                      {formData.teachers.map(({ id, name }) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer text-muted-foreground inline-flex items-center gap-1"
                          onClick={() =>
                            toggleInArray('teachers', { id, name })
                          }
                          aria-label={`${name} を削除`}
                        >
                          <span>{name}</span>
                          <span aria-hidden="true">✕</span>
                        </Badge>
                      ))}
                    </section>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6 gap-2 sm:justify-between">
                <Button type="button" variant="outline" onClick={handleClose}>
                  キャンセル
                </Button>
                <Button type="submit">作成</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
