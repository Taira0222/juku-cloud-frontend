import { useState } from "react";
import { Button } from "@/components/ui/form/Button/button";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/form/Calendar/calendar";
import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { dateToISO } from "@/features/students/utils/studentFormTransforms";
import { format, parseISO } from "date-fns";

export type ExpireDatePickerProps = {
  expireDate?: string;
  onChange: (v: string) => void;
};

export const ExpireDatePicker = ({
  expireDate,
  onChange,
}: ExpireDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = expireDate ? parseISO(expireDate) : undefined;
  const label = selected ? format(selected, "yyyy/MM/dd") : "日付を選択";

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3">
        <RequiredLabel htmlFor="expireDate" required>
          有効期限
        </RequiredLabel>
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              id="expireDate"
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
};
