import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import type { StudentDetail } from "@/features/studentDashboard/type/studentDashboard";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { formatGrade } from "@/utils/formatGrade";
import type { UseQueryResult } from "@tanstack/react-query";
import { Navigate, useOutletContext } from "react-router-dom";

export const DashboardPage = () => {
  const { data, isError, error } =
    useOutletContext<UseQueryResult<StudentDetail, unknown>>();

  if (!data) return <Navigate to="404" replace />;

  const formattedGrade = formatGrade(data.school_stage, data.grade);
  const desiredSchool = data.desired_school ?? "未設定";

  return (
    <div>
      {isError && <ErrorDisplay error={getErrorMessage(error)} />}
      {/* 名前、学年、志望校*/}
      <h1 className="mb-4 text-2xl font-bold">{data.name}</h1>
      <p className="mb-2 text-lg">{formattedGrade}</p>
      <p className="mb-6 text-lg">志望校: {desiredSchool}</p>
    </div>
  );
};
