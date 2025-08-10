import { useEffect, useState } from 'react';
import { fetchTeachers } from '../../services/teachersApi';
import {
  isFetchTeachersErrorResponse,
  type currentUser,
  type fetchTeachersSuccessResponse,
  type teachers,
} from '../../types/teachers';
import { isAxiosError } from 'axios';

export const useFetchTeachers = () => {
  const [currentUserData, setCurrentUserData] = useState<currentUser | null>(
    null
  );
  const [teachersData, setTeachersData] = useState<teachers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        setLoading(true);
        const data: fetchTeachersSuccessResponse = await fetchTeachers();
        setCurrentUserData(data.current_user);
        setTeachersData(data.teachers);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const responseData = error.response?.data;
          if (isFetchTeachersErrorResponse(responseData)) {
            setError(responseData.error);
          } else {
            setError('予期しないエラーが発生しました。');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersData();
  }, []);

  return { currentUserData, teachersData, error, loading };
};
