import { useEffect, useState } from 'react';
import { fetchTeachers } from '../services/teachersApi';
import type { fetchTeachersResponse } from '../types/teacher';
import axios from 'axios';

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
        if (axios.isAxiosError(error)) {
          const responseError = error.response?.data;
          if (responseError?.error) {
            setError(responseError.error); // APIからのエラーメッセージ
          } else {
            setError('予期しないエラーが発生しました。'); // その他のエラー
          }
        } else {
          setError('ネットワークエラーが発生しました。'); // Axios 以外のエラー
        }
      }
    };

    fetchTeachersData();
  }, []);
  return { currentUser, teachers, error };
};
