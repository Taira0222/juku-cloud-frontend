import { Spinner } from '@/components/ui/form/Spinner/spinner';

type Props = {
  children: string;
  className?: string;
};

const SpinnerWithText = ({ children, className }: Props) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Spinner>{children}</Spinner>
    </div>
  );
};

export default SpinnerWithText;
