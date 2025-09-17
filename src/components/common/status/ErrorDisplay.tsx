type Props = {
  error: string[] | null;
  className?: string;
  childClassName?: string;
};
export const ErrorDisplay = ({ error, className, childClassName }: Props) => {
  if (!error) return null;

  return (
    <div className={`p-6 ${className}`}>
      <ul>
        {error.map((errMsg, index) => (
          <li key={index} className={`text-red-500 mb-4 ${childClassName}`}>
            {errMsg}
          </li>
        ))}
      </ul>
    </div>
  );
};
