export const formatIsoToDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(); // ローカルの日付形式で返す
};
