import { Button } from '@/components/ui/form/Button/button';
import { Input } from '@/components/ui/form/Input/input';
import { Label } from '@/components/ui/form/Label/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/navigation/Dialog/dialog';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useTeachersStore } from '@/stores/teachersStore';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import { EMPLOYMENT_STATUS_TRANSLATIONS } from '@/constants/teacherEmploymentStatusTranslation';
import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';
import { Badge } from '@/components/ui/display/Badge/badge';
import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { TeacherStudentsSelector } from '../fields/TeacherStudentsSelector';
import { useFormatEditData } from '../../hooks/useFormatEditData';
import { useTeacherUpdate } from '../../hooks/useTeacherUpdate';
import { toast } from 'sonner';
import SpinnerWithText from '@/components/common/status/Loading';

export type updateTeacherData = {
  name: string;
  employment_status: string;
  subjects: {
    id: number;
    name: string;
  }[];
  available_days: {
    id: number;
    name: string;
  }[];
  students: {
    id: number;
    student_code: string;
    name: string;
    status: string;
    school_stage: string;
    grade: number;
  }[];
};
// toggleInArray を使用するkey の型
type ToggleableKeys = 'subjects' | 'available_days';

// 文字列を正規化して学年ステージの値に変換する関数
// STAGE_OPTIONS[number] はSTAGE_OPTIONS のすべての要素の型のユニオンを表す
const normalizeStage = (
  raw: string
): 'elementary' | 'junior_high' | 'high_school' | null => {
  const v = raw.toLowerCase();
  if (v.includes('elementary') || v.includes('小')) return 'elementary';
  if (v.includes('junior') || v.includes('中')) return 'junior_high';
  if (v.includes('high') || v.includes('高')) return 'high_school';
  return null;
};

// 小1〜高3の候補
const LEVEL_OPTIONS = [
  ...Array.from({ length: 6 }, (_, i) => ({
    value: `elementary-${i + 1}`,
    label: `小学${i + 1}年`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `junior_high-${i + 1}`,
    label: `中学${i + 1}年`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `high_school-${i + 1}`,
    label: `高校${i + 1}年`,
  })),
] as const;

// 'elementary-3' なら { stage:'elementary', grade:3 } を返す
const parseLevel = (v: string) => {
  const [stage, g] = v.split('-');
  return { stage, grade: Number(g) };
};

const stageLabel = (normalized: string) => {
  const map: Record<string, string> = {
    elementary: '小',
    junior_high: '中',
    high_school: '高',
  };
  return map[normalized] ?? normalized;
};

export const EditTeacherDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const { id } = useParams<{ id: string }>();
  const detailDrawer = useTeachersStore((state) => state.detailDrawer);
  const updateTeacherLocal = useTeachersStore(
    (state) => state.updateTeacherLocal
  );
  const isMobile = useIsMobile();

  const teacherId = id ? parseInt(id, 10) : 0;
  const teacher = detailDrawer.find((t) => t.id === teacherId);

  const students = useMemo(() => {
    // id と studentを所有したmap (例 {10, { id: 10, name: '山田', school_stage: '小学校', grade: 3 }}) が入る
    const m = new Map<
      number,
      (typeof detailDrawer)[number]['students'][number]
    >();
    detailDrawer.forEach((teacher) => {
      teacher.students.forEach((student) => {
        m.set(student.id, student);
      });
    });
    // Mapから配列に変換して返す
    return Array.from(m.values());
  }, [detailDrawer]);

  // 講師の初期値
  const initialName = teacher?.name || '';
  const initialEmploymentStatus = teacher?.employment_status || '';
  const initialSubjects = teacher?.class_subjects.map((s) => s.name) || [];
  const initialAvailableDays = teacher?.available_days.map((d) => d.name) || [];
  // 重複のない生徒IDの配列
  const initialStudentsIds = Array.from(
    new Set(teacher?.students.map((s) => s.id) || [])
  );

  // フォームの状態管理
  const [formData, setFormData] = useState({
    name: initialName,
    employment_status: initialEmploymentStatus,
    subjects: initialSubjects,
    available_days: initialAvailableDays,
    student_ids: initialStudentsIds,
  });
  const [level, setLevel] = useState<'all' | string>('all');
  // teacherStore 更新用の成型済みデータを取得
  const { formatSubjectsData, formatDaysData, formatStudentsData } =
    useFormatEditData({
      formData,
      detailDrawer,
    });

  const { error, loading, updatedId, updateTeacher } = useTeacherUpdate();

  // エラーハンドリングによる画面遷移
  if (state?.background === undefined) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  if (!teacher) {
    return <Navigate to="/teachers" state={{ from: location }} replace />;
  }

  // 名前の変更
  const handleInputChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // 出勤状況の変更
  const handleSelectEmployment = (value: string) => {
    setFormData((prev) => ({ ...prev, employment_status: value }));
  };

  // 配列のトグル操作ユーティリティ関数
  const toggleValue = <T,>(list: T[], v: T) => {
    const arr = new Set(list);
    if (arr.has(v)) {
      arr.delete(v);
    } else {
      arr.add(v);
    }
    return Array.from(arr);
  };

  const toggleInArray = (key: ToggleableKeys, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: toggleValue(prev[key], value) }));
  };

  const handleClose = () => {
    navigate(-1);
  };
  // 更新ボタンを押したときの処理
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // フォームデータをAPIに送信する形式に整形する
    // パフォーマンス的に、handleSubmitが呼び出された際にのみこの処理が実行されるようにする
    const submitData = {
      name: formData.name,
      employment_status: formData.employment_status,
      subject_ids: formatSubjectsData()
        .filter((subject) => subject.id !== undefined)
        .map((subject) => subject.id),
      available_day_ids: formatDaysData()
        .filter((day) => day.id !== undefined)
        .map((day) => day.id),
      student_ids: formatStudentsData()
        .filter((student) => student.id !== undefined)
        .map((student) => student.id),
    };

    const result = await updateTeacher(teacherId, submitData);

    if (result.ok) {
      updateTeacherLocal(updatedId ?? teacherId, {
        name: formData.name,
        employment_status: formData.employment_status,
        subjects: formatSubjectsData(),
        available_days: formatDaysData(),
        students: formatStudentsData(),
      });

      toast.success('更新に成功しました');
      handleClose();
    } else {
      toast.error('更新に失敗しました');
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()} // iOSのフォーカスずれ防止
        className={cn(
          'sm:max-w-lg overflow-y-auto',
          isMobile
            ? 'top-12 translate-y-0 max-h-[85dvh]' // モバイル: 上寄せ + 本体スクロール
            : 'top-1/2 -translate-y-1/2 max-h-[90dvh]' // デスクトップ: 中央寄せ
        )}
      >
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-5">
          <DialogHeader>
            <DialogTitle>講師を編集</DialogTitle>
            <div className="text-muted-foreground leading-7">
              {loading && '読み込み中'}
              {!loading && (
                <span>講師「{teacher?.name}」の情報を編集します。</span>
              )}
            </div>
            <DialogDescription>
              講師の基本情報を変更できます。
            </DialogDescription>
          </DialogHeader>
          {/* API の読み込み中 */}
          {loading && (
            <div className="flex items-center justify-center h-32">
              <SpinnerWithText>Loading...</SpinnerWithText>
            </div>
          )}

          {/* 正常時のレンダリング */}
          {!loading && (
            <>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">講師名</Label>
                  <Input
                    id="teacherName"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="講師名を入力してください"
                    required
                  />
                </div>

                {/* 出勤状況：Select */}
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">出勤状況</Label>
                  <Select
                    value={formData.employment_status}
                    onValueChange={handleSelectEmployment}
                  >
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EMPLOYMENT_STATUS_TRANSLATIONS).map(
                        ([key, { name }]) => (
                          <SelectItem key={key} value={key}>
                            {name}（{key}）
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* 担当科目：複数チェック */}
                <div className="space-y-2">
                  <Label>担当科目（複数可）</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/** 複数選択可能な担当科目のチェックボックス */}
                    {Object.entries(SUBJECT_TRANSLATIONS).map(
                      ([key, { name }]) => (
                        <label key={key} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.subjects.includes(key)}
                            onCheckedChange={() =>
                              toggleInArray('subjects', key)
                            }
                            aria-label={name}
                          />
                          <span>{name}</span>
                        </label>
                      )
                    )}
                  </div>
                  {/** 選択された担当科目を表示するバッジ */}
                  {formData.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.subjects.map((v) => {
                        const label = SUBJECT_TRANSLATIONS[v]?.name ?? v;
                        const Icon = SUBJECT_TRANSLATIONS[v]?.icon;
                        const color = SUBJECT_TRANSLATIONS[v]?.color ?? 'gray';
                        return (
                          <Badge
                            key={v}
                            variant="secondary"
                            className={`cursor-pointer text-muted-foreground px-1.5 mx-1 ${color}`}
                            onClick={() => toggleInArray('subjects', v)}
                          >
                            {Icon && (
                              <Icon
                                aria-hidden="true"
                                className="mr-1 inline-block"
                              />
                            )}
                            {label} ✕
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 担当可能曜日：複数チェック */}
                <div className="space-y-2">
                  <Label>担当可能曜日（複数可）</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(DAY_OF_WEEK_TRANSLATIONS).map(
                      ([key, name]) => (
                        <label key={key} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.available_days.includes(key)}
                            onCheckedChange={() =>
                              toggleInArray('available_days', key)
                            }
                            aria-label={name}
                          />
                          <span>{name}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* 担当生徒 */}
                <TeacherStudentsSelector
                  allStudents={students}
                  selectedIds={formData.student_ids}
                  level={level}
                  onChangeLevel={(v) => setLevel(v)}
                  onChangeSelected={(ids) =>
                    setFormData((prev) => ({ ...prev, student_ids: ids }))
                  }
                  levelOptions={[...LEVEL_OPTIONS]}
                  normalizeStage={normalizeStage}
                  stageLabel={stageLabel}
                  parseLevel={parseLevel}
                />
              </div>

              <DialogFooter className="mt-6 gap-2 sm:justify-between">
                <Button type="button" variant="outline" onClick={handleClose}>
                  キャンセル
                </Button>
                <Button type="submit">更新</Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
