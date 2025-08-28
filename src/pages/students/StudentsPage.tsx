import { useFetchStudents } from '@/features/students/queries/useFetchStudents';

export const StudentsPage = () => {
  const { students, error } = useFetchStudents();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">学生管理</h1>
      <p className="text-muted-foreground mb-6">
        学生の情報を管理するためのセクションです。
      </p>
      {error && <p className="text-red-500">{error}</p>}
      {students && (
        <ul>
          {students.map((student) => (
            <li key={`student-${student.id}`}>
              {student.student_code}
              {student.name}
              {student.school_stage}
              {student.grade}
              {student.status}
              {student.teachers.map((teacher) => (
                <div key={`teacher-${teacher.id}`}>
                  <p>教師名: {teacher.name}</p>
                  <p>メール: {teacher.email}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
