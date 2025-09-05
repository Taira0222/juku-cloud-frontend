import { Label } from '@/components/ui/form/Label/label';

type RequiredLabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

export const RequiredLabel = ({
  htmlFor,
  children,
  required,
}: RequiredLabelProps) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-1">
    {children}
    {required && <span className="text-red-500">*</span>}
  </Label>
);
