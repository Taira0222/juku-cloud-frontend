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

// toggleInArray を使用するkey の型
type ToggleableKeys = 'subjects' | 'available_days';

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

  // teacherStore 更新用の成型済みデータを取得
  const { formatSubjectsData, formatDaysData, formatStudentsData } =
    useFormatEditData({
      formData,
      detailDrawer,
    });

  const { error, loading, updateTeacher } = useTeacherUpdate();

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
      const updatedId = result.updatedId;
      if (updatedId == null) {
        toast.error('APIレスポンスに更新IDが含まれていません。');
        return;
      }
      updateTeacherLocal(updatedId, {
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
                            {name}({key})
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
                      ([key, { name }]) => {
                        const checkboxId = `subject-checkbox-${key}`;
                        return (
                          <div key={key} className="flex items-center gap-2 ">
                            <Checkbox
                              id={checkboxId}
                              checked={formData.subjects.includes(key)}
                              onCheckedChange={() =>
                                toggleInArray('subjects', key)
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
                  {formData.subjects.length > 0 && (
                    <section
                      aria-label="選択中の担当科目"
                      className="flex flex-wrap gap-2 pt-1"
                    >
                      {formData.subjects.map((v) => {
                        const label = SUBJECT_TRANSLATIONS[v]?.name ?? v;
                        const Icon = SUBJECT_TRANSLATIONS[v]?.icon;
                        const color = SUBJECT_TRANSLATIONS[v]?.color ?? 'gray';

                        return (
                          <Badge
                            key={v}
                            variant="secondary"
                            className={`px-0 py-0 ${color}`}
                            asChild
                          >
                            <button
                              type="button"
                              className="cursor-pointer text-muted-foreground px-1.5 py-1 mx-1 inline-flex items-center gap-1 rounded"
                              onClick={() => toggleInArray('subjects', v)}
                              aria-label={`${label} を削除`}
                            >
                              {Icon && (
                                <Icon
                                  aria-hidden="true"
                                  className="inline-block"
                                />
                              )}
                              <span>{label}</span>
                              <span aria-hidden="true">✕</span>{' '}
                            </button>
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
                    {Object.entries(DAY_OF_WEEK_TRANSLATIONS).map(
                      ([key, name]) => {
                        const checkboxId = `day-checkbox-${key}`;
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <Checkbox
                              id={checkboxId}
                              checked={formData.available_days.includes(key)}
                              onCheckedChange={() =>
                                toggleInArray('available_days', key)
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
                      }
                    )}
                  </div>
                </div>

                {/* 担当生徒 */}
                <TeacherStudentsSelector
                  allStudents={students}
                  selectedIds={formData.student_ids}
                  onChangeSelected={(ids) =>
                    setFormData((prev) => ({ ...prev, student_ids: ids }))
                  }
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
