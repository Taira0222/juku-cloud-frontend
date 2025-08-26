import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import { Label } from '@/components/ui/form/Label/label';
import { Badge } from '@/components/ui/display/Badge/badge';
import { normalizeStage, parseLevel, stageLabel } from '../../utils/teachers';
import { LEVEL_OPTIONS } from '../../constants/teachers';

export type LevelOption = { value: string; label: string };
type Student = {
  id: number;
  name: string;
  school_stage: string;
  grade: number | string;
};

export type TeacherStudentsSelectorProps = {
  allStudents: Student[];
  selectedIds: number[];
  onChangeSelected: (nextIds: number[]) => void; // 例: FormatData のセッター
};

export const TeacherStudentsSelector = ({
  allStudents,
  selectedIds,
  onChangeSelected,
}: TeacherStudentsSelectorProps) => {
  const [level, setLevel] = useState<'all' | string>('all');
  const levelOptions = [...LEVEL_OPTIONS];
  // level に基づいて生徒をフィルタリング
  const filtered = useMemo(() => {
    if (level === 'all') return allStudents;
    // level はselector から選択された値で、例えば 'elementary-1' のような形式
    const { stage, grade } = parseLevel(level);
    return allStudents.filter(
      (s) =>
        normalizeStage(s.school_stage) === stage && Number(s.grade) === grade
    );
  }, [allStudents, level, normalizeStage, parseLevel]);

  // すでにある場合は削除、なければ追加するトグル関数
  const toggleId = (id: number) => {
    if (selectedIds.includes(id)) {
      onChangeSelected(selectedIds.filter((x) => x !== id));
    } else {
      onChangeSelected([...selectedIds, id]);
    }
  };

  const getStageText = (student?: Student) => {
    if (!student) return null;
    const normalized = normalizeStage(student.school_stage);
    return normalized ? stageLabel(normalized) : student.school_stage;
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="level">担当生徒（複数可）</Label>
        {/** 学年選択用のドロップダウン */}
        <Select value={level} onValueChange={(v) => setLevel(v)}>
          <SelectTrigger id="level">
            <SelectValue placeholder="学年を選択" />
          </SelectTrigger>
          <SelectContent>
            {/** デフォルトはすべてが表示されている */}
            <SelectItem value="all" id="all">
              すべて
            </SelectItem>
            {levelOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} id={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/** フィルタリングされた生徒の数と選択されている生徒の数を表示 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          該当：{filtered.length}名 / 選択：{selectedIds.length}名
        </span>
      </div>

      {/** フィルタリングされた生徒のリスト */}
      <div className="max-h-48 overflow-y-auto rounded border p-2 space-y-2">
        {filtered.map((st) => {
          // normalizeStage で学校のステージを標準化し、stageLabel で表示用のラベルに変換する
          const stg = normalizeStage(st.school_stage);
          const label = `${st.name}（${
            stg ? stageLabel(stg) : st.school_stage
          }${st.grade}）`;
          const checkboxId = `student-checkbox-${st.id}`;
          return (
            <div key={st.id} className="flex items-center gap-2">
              <Checkbox
                id={checkboxId}
                checked={selectedIds.includes(st.id)}
                onCheckedChange={() => toggleId(st.id)}
                aria-label={label}
              />
              <Label htmlFor={checkboxId} className="font-normal text-base">
                {st.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {stg ? stageLabel(stg) : st.school_stage}
                  {st.grade}
                </span>
              </Label>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">
            該当する生徒がいません
          </div>
        )}
      </div>
      {/** 選択されている生徒のIDを表示し、クリックで解除できる */}
      {selectedIds.length > 0 && (
        <section
          className="flex flex-wrap gap-2 pt-1"
          aria-label="選択された生徒の一覧"
        >
          {selectedIds.map((sid) => {
            const student = allStudents.find((x) => x.id === sid);

            // 表示用の学年ラベル
            const stageText = getStageText(student);

            // 表示用の文字列
            const label = student
              ? `${student.name}（${stageText}${student.grade}）`
              : `ID:${sid}`;

            return (
              <Badge
                key={sid}
                variant="secondary"
                className="cursor-pointer"
                asChild
              >
                <button
                  onClick={() => toggleId(sid)}
                  className="flex items-center gap-1"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">✕</span>
                </button>
              </Badge>
            );
          })}
        </section>
      )}
    </div>
  );
};
