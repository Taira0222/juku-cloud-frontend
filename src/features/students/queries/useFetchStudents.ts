import { useEffect, useState } from 'react';
import { fetchStudents } from '../api/studentsApi';
import {
  isFetchStudentsErrorResponse,
  type fetchStudentsResponse,
} from '../types/students';
import { isAxiosError } from 'axios';

export const useFetchStudents = () => {
  const [students, setStudents] = useState<fetchStudentsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const data: fetchStudentsResponse = await fetchStudents();
        setStudents(data);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const responseData = error.response?.data;
          if (isFetchStudentsErrorResponse(responseData)) {
            setError(responseData.error); // APIからのエラーメッセージ
          } else {
            setError('予期しないエラーが発生しました。'); // その他のエラー
          }
        }
      }
    };

    fetchStudentsData();
  }, []);

  return { students, error };
};
