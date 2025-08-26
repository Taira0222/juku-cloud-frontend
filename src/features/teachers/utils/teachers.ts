// elementary → 小 に変えるメソッド
export const stageLabel = (normalized: string) => {
  const map: Record<string, string> = {
    elementary: '小',
    junior_high: '中',
    high_school: '高',
  };
  return map[normalized] ?? '';
};

// 文字列を正規化して学年ステージの値に変換する関数
// STAGE_OPTIONS[number] はSTAGE_OPTIONS のすべての要素の型のユニオンを表す
export const normalizeStage = (
  raw: string
): 'elementary' | 'junior_high' | 'high_school' | null => {
  const v = raw.toLowerCase();
  if (v.includes('elementary') || v.includes('小')) return 'elementary';
  if (v.includes('junior') || v.includes('中')) return 'junior_high';
  if (v.includes('high') || v.includes('高')) return 'high_school';
  return null;
};

// 'elementary-3' なら { stage:'elementary', grade:3 } を返す
export const parseLevel = (v: string) => {
  const [stage, g] = v.split('-');
  return { stage, grade: Number(g) };
};
