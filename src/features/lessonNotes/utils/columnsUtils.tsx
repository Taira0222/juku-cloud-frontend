import { Badge } from "@/components/ui/display/Badge/badge";
import { IconCalendarX } from "@tabler/icons-react";
import { NOTE_TYPE } from "../constants/lessonNote";
import type { NoteType } from "@/features/studentDashboard/type/studentDashboard";

export const columnsUtils = () => {
  const formatExpireDate = (isoString: string) => {
    if (!isoString) return "無効な日付";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "無効な日付";

    const today = new Date();
    const isPast = date < today;

    if (isPast) {
      return (
        // 期限切れのバッジを作成
        <Badge
          variant="outline"
          className={"text-muted-foreground px-1.5 mx-1 "}
        >
          <IconCalendarX
            aria-hidden="true"
            className="fill-gray-300 dark:fill-red-400"
          />
          期限切れ
        </Badge>
      );
    } else {
      // 通常の日付表示
      const displayDate = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
      return <span>{displayDate}</span>;
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
