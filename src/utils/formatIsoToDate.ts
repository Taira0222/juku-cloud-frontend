import { format, parseISO } from "date-fns";

export const parseAndFormatDate = (isoString: string): string | null => {
  if (!isoString) return null;
  try {
    return format(parseISO(isoString), "yyyy/MM/dd"); // "2025/09/03" 形式
  } catch {
    return null;
  }
};

export const formatIsoToDate = (isoString: string) => {
  return parseAndFormatDate(isoString) ?? "無効な日付";
};
