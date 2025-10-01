import { Badge } from "@/components/ui/display/Badge/badge";
import { IconCalendarX } from "@tabler/icons-react";
import { NOTE_TYPE } from "../constants/lessonNoteTable";
import type { NoteType } from "@/features/studentDashboard/type/studentDashboard";
import { parseAndFormatDate } from "@/utils/formatIsoToDate";

export const columnsUtils = () => {
  const formatExpireDate = (isoString: string) => {
    const formattedDate = parseAndFormatDate(isoString);
    if (!formattedDate) {
      return <span className="text-muted-foreground">無効な日付</span>;
    }
    const date = new Date(isoString);
    const today = new Date();

    if (date < today) {
      return (
        // 期限切れのバッジを作成
        <Badge variant="outline" className="text-muted-foreground px-1.5 mx-1">
          <IconCalendarX
            aria-hidden="true"
            className="fill-gray-300 dark:fill-red-400"
          />
          期限切れ
        </Badge>
      );
    } else {
      // 通常の日付表示
      return <span>{formattedDate}</span>;
    }
  };
  const formatNoteType = (en: NoteType) => {
    const note = NOTE_TYPE[en];

    return (
      <Badge variant="outline" className="text-muted-foreground px-1.5 mx-1">
        <note.Icon
          aria-hidden="true"
          data-testid={`lesson-note-icon-${en}`}
          className={`${note.color}`}
        />
        {note.name}
      </Badge>
    );
  };
  return { formatExpireDate, formatNoteType };
};
