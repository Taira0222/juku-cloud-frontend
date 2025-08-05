import { useEffect, useState } from 'react';
import { fetchTeachers } from '../services/teachersApi';
import {
  isFetchTeachersErrorResponse,
  type fetchTeachersResponse,
} from '../types/teacher';
import { isAxiosError } from 'axios';

export const useFetchTeachers = () => {
  const [currentUser, setCurrentUser] = useState<
    fetchTeachersResponse['current_user'] | null
  >(null);
  const [teachers, setTeachers] = useState<
    fetchTeachersResponse['teachers'] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const data: fetchTeachersResponse = await fetchTeachers();
        setCurrentUser(data.current_user);
        setTeachers(data.teachers);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const responseData = error.response?.data;
          if (isFetchTeachersErrorResponse(responseData)) {
            setError(responseData.error); // APIからのエラーメッセージ
          } else {
            setError('予期しないエラーが発生しました。'); // その他のエラー
          }
        }
      }
    };

    fetchTeachersData();
  }, []);
  return { currentUser, teachers, error };
};
