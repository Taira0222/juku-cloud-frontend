import { useState } from 'react';
import { Button } from '@/components/ui/form/Button/button';
import { ChevronDownIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/form/Calendar/calendar';
import type { Draft } from '../../../types/studentForm';
import { RequiredLabel } from '@/components/common/form/RequiredLabel';
import {
  dateToISO,
  isoToDate,
} from '@/features/students/utils/studentFormTransforms';

export default function JoinedOnPicker({
  value,
  onChange,
}: {
  value: Draft;
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = isoToDate(value.joined_on);
  const label = selected
    ? new Intl.DateTimeFormat('ja-JP').format(selected)
    : '日付を選択';

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3">
        <RequiredLabel htmlFor="date" required>
          入塾日
        </RequiredLabel>
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {label}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="z-50 w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={selected}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                onChange(dateToISO(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
