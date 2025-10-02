import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { studentTraitKeys, type StudentTraitListFilters } from "../key";

import { FetchStudentTraits } from "../api/studentTraitsApi";
import type { FetchStudentTraitsResponse } from "../types/studentTraits";

type Opts = { enabled?: boolean };
export const useStudentTraitsQuery = (
  filters: StudentTraitListFilters,
  opts?: Opts
) =>
  useQuery<FetchStudentTraitsResponse, unknown>({
    queryKey: studentTraitKeys.list(filters),
    queryFn: () => FetchStudentTraits(filters),
    placeholderData: keepPreviousData,
    ...opts,
  });
