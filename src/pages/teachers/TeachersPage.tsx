import { useFetchTeachers } from '@/features/teachers/hooks/useFetchTeachers';

export const TeachersPage = () => {
  const { currentUser, teachers, error } = useFetchTeachers();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">教師管理</h1>
      <p className="text-muted-foreground mb-6">
        教師の情報を管理するためのセクションです。
      </p>
      {/* 教師管理のコンテンツをここに追加 */}
      {error && <p className="text-red-500 mb-4">エラー: {error}</p>}
      {currentUser && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">現在のユーザー</h2>
          <p>名前: {currentUser.name}</p>
          <p>メール: {currentUser.email}</p>
          <p>
            {currentUser.students.map((student) => (
              <span key={student.id}>
                {student.student_code} - {student.name}
              </span>
            ))}
          </p>
        </div>
      )}
      {teachers && teachers.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold">教師一覧</h2>
          <ul className="list-disc pl-5">
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                {teacher.name} ({teacher.email})<br />
                {teacher.students.map((student) => (
                  <span key={student.id}>
                    {student.student_code} - {student.name}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>教師が登録されていません。</p>
      )}
    </div>
  );
};
