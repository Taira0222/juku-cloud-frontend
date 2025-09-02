export const formatIsoToDate = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return ''; // 不正な日付も空文字で返す
  return new Intl.DateTimeFormat('ja-JP', {
    // 日本のローカル日付形式で返す
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
