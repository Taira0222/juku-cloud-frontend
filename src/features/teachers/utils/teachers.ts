// elementary → 小 に変えるメソッド
export const stageLabel = (normalized: string) => {
  const map: Record<string, string> = {
    elementary: '小',
    junior_high: '中',
    high_school: '高',
  };
  return map[normalized] ?? normalized;
};
