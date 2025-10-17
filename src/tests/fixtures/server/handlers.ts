import {
  currentUserResponse,
  teacher1,
  teachers,
} from "@/tests/fixtures/teachers/teachers";
import {
  type StudentCreateRequestBodyType,
  type Errors,
  type InviteTokenCreateResponseBodyType,
  type SignInRequestBodyType,
  type SignInResponseBodyType,
  type SignUpRequestBodyType,
  type SignUpResponseBodyType,
  type StudentCreateResponseBodyType,
  type StudentFetchRequestBodyType,
  type StudentFetchResponseBodyType,
  type TeacherDeletePathParams,
  type TeacherDeleteResponseBodyType,
  type TeacherFetchResponseBodyType,
  type TeacherUpdatePathParams,
  type TeacherUpdateRequestBodyType,
  type TeacherUpdateResponseBodyType,
  type TokenConfirmPathParams,
  type TokenConfirmResponseBodyType,
  type StudentUpdatePathParams,
  type StudentUpdateRequestBodyType,
  type StudentUpdateResponseBodyType,
  type LessonNoteFetchRequestBodyType,
  type LessonNoteFetchResponseBodyType,
  type StudentDetailPathParams,
  type StudentDetailResponseBodyType,
  type StudentTraitsRequestBodyType,
  type StudentTraitsResponseBodyType,
  type LessonNoteCreateRequestBodyType,
  type LessonNoteCreateResponseBodyType,
  type LessonNoteDeletePathParams,
  type LessonNoteDeleteRequestBodyType,
  type LessonNoteDeleteResponseBodyType,
  type LessonNoteUpdatePathParams,
  type StudentTraitCreateRequestBodyType,
  type StudentTraitCreateResponseBodyType,
  type StudentTraitDeletePathParams,
  type StudentTraitDeleteRequestBodyType,
  type StudentTraitDeleteResponseBodyType,
  type StudentTraitUpdatePathParams,
  type StudentTraitUpdateRequestBodyType,
  type StudentTraitUpdateResponseBodyType,
} from "@/tests/fixtures/server/types/msw";
import { http, HttpResponse } from "msw";
import {
  mockMeta,
  mockStudent1,
  mockStudent4,
  studentDetailMock,
  studentsMock,
} from "../students/students";
import { lessonNotesMock } from "../lessonNotes/lessonNotes";
import { mockStudentTraits } from "../studentTraits/studentTraits";
import { currentAdminUser } from "../user/user";
import { format } from "date-fns";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_ID = "1";

export const handlers = [
  // サインインのハンドラー
  http.post<never, SignInRequestBodyType, SignInResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/auth/sign_in`,
    async ({ request }) => {
      // リクエストボディからemailとpasswordを取得
      const body = await request.json();
      const { email, password } = body;

      // テスト用の認証情報
      const testEmail = "test@example.com";
      const testPassword = "password123";

      // エラーメッセージの内容
      const errorMessage = "ログインに失敗しました。もう一度お試しください。";

      if (email === testEmail && password === testPassword) {
        // 成功時のレスポンス
        return HttpResponse.json(
          {
            data: {
              email: testEmail,
              provider: "email",
              uid: "fake-uid",
              id: 1,
              allow_password_change: false,
              name: "Test User",
              role: "teacher",
              school_stage: "bachelor",
              grade: 1,
              graduated_university: "Fake University",
            },
          },
          {
            status: 200,
            headers: {
              "access-token": "fake-access-token",
              client: "fake-client",
              uid: "fake-uid",
              "token-type": "Bearer",
              expiry: "1754694561", // string としてわたってくるので、Date型に変換する必要はない
            },
          }
        );
      } else {
        // 失敗時のレスポンス
        return HttpResponse.json(
          {
            errors: [
              {
                code: "INVALID_LOGIN",
                message: errorMessage,
              },
            ],
          },
          {
            status: 401,
          }
        );
      }
    }
  ),
  // サインアップのハンドラー
  http.post<never, SignUpRequestBodyType, SignUpResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/auth`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password, password_confirmation, token, name } = body;

      // エラーを収集する配列
      const errors: Errors = [];

      // バリデーション
      // メールアドレスの重複チェック
      if (email === "duplicate@example.com") {
        errors.push({
          code: "EMAIL_TAKEN",
          field: "email",
          message: "メールアドレスはすでに使用されています。",
        });
      }

      // パスワードの長さチェック
      if (password && password.length < 6) {
        errors.push({
          code: "PASSWORD_TOO_SHORT",
          field: "password",
          message: "パスワードは6文字以上で入力してください。",
        });
      }

      // パスワード確認チェック
      if (password !== password_confirmation) {
        errors.push({
          code: "PASSWORD_CONFIRMATION_MISMATCH",
          field: "password_confirmation",
          message: "パスワードが一致しません。",
        });
      }

      // tokenの有効性チェック
      if (token !== "123456") {
        errors.push({
          code: "INVALID_TOKEN",
          field: "token",
          message: "トークンが無効です。",
        });
      }

      // エラーがある場合
      if (errors.length > 0) {
        return HttpResponse.json(
          {
            errors: errors,
          },
          {
            status: 422,
          }
        );
      }

      // 成功時のレスポンス
      return HttpResponse.json(
        {
          data: {
            id: 1,
            provider: "email",
            uid: "fake-uid",
            allow_password_change: false,
            name: name || "Test User",
            role: "admin",
            school_stage: null,
            grade: null,
            graduated_university: null,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          status: 200,
        }
      );
    }
  ),
  // 講師一覧のハンドラー
  http.get<never, never, TeacherFetchResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/teachers`,
    async () => {
      try {
        return HttpResponse.json(
          {
            current_user: currentUserResponse,
            teachers: teachers,
          },
          {
            status: 200,
          }
        );
      } catch {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "INTERNAL_SERVER_ERROR",
                message: "予期せぬエラーが発生しました。",
              },
            ],
          },
          { status: 500 }
        );
      }
    }
  ),

  // 講師作成用のトークン作成用のハンドラー
  http.post<never, never, InviteTokenCreateResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/invites`,
    async () => {
      try {
        return HttpResponse.json(
          {
            token: "123456",
          },
          {
            status: 200,
          }
        );
      } catch {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "CREATE_TOKEN_FAILED",
                field: "base",
                message: "トークンの作成に失敗しました。",
              },
            ],
          },
          { status: 422 }
        );
      }
    }
  ),

  // 確認メールのトークン確認のハンドラー
  http.get<TokenConfirmPathParams, never, TokenConfirmResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/invites/:token`,
    async ({ params }) => {
      try {
        const token = params.token;
        if (token !== "123456") {
          return HttpResponse.json(
            {
              errors: [
                {
                  code: "INVALID_OR_EXPIRED_TOKEN",
                  message: "この招待リンクは無効か期限切れです。",
                },
              ],
            },
            {
              status: 404,
            }
          );
        }

        return HttpResponse.json(
          { school_name: "First_school" },
          { status: 200 }
        );
      } catch {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "INTERNAL_SERVER_ERROR",
                message: "予期せぬエラーが発生しました。",
              },
            ],
          },
          { status: 500 }
        );
      }
    }
  ),

  // 講師削除のハンドラー
  http.delete<TeacherDeletePathParams, never, TeacherDeleteResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/teachers/:id`,
    async ({ params }) => {
      const { id } = params;
      const teacher1Id = teacher1.id.toString();
      try {
        // 成功時にはstatus のみ返却する
        if (id === teacher1Id) {
          return new HttpResponse(null, { status: 204 });
        }
      } catch {
        // idが1の時はadminのため削除できない
        if (id === ADMIN_ID) {
          return HttpResponse.json(
            {
              errors: [
                {
                  code: "FORBIDDEN",
                  message: "管理者は削除できません。",
                },
              ],
            },
            { status: 403 }
          );
          // フロントに削除ボタンはあるけど、db 側でユーザーが見つからない想定
        } else if (id !== teacher1Id) {
          return HttpResponse.json(
            {
              errors: [
                {
                  code: "NOT_FOUND",
                  message: "ユーザーが見つかりませんでした。",
                },
              ],
            },
            { status: 404 }
          );
        } else {
          return HttpResponse.json(
            {
              errors: [
                {
                  code: "INTERNAL_SERVER_ERROR",
                  message: "予期せぬエラーが発生しました。",
                },
              ],
            },
            { status: 500 }
          );
        }
      }
    }
  ),
  // 講師更新のハンドラー
  http.patch<
    TeacherUpdatePathParams,
    TeacherUpdateRequestBodyType,
    TeacherUpdateResponseBodyType
  >(`${VITE_API_BASE_URL}/api/v1/teachers/:id`, async ({ params }) => {
    const { id } = params;

    return HttpResponse.json(
      {
        teacher_id: Number(id),
      },
      {
        status: 200,
      }
    );
  }),

  http.get<never, StudentFetchRequestBodyType, StudentFetchResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/students`,
    async ({ request }) => {
      const url = new URL(request.url);
      const gradeParam = url.searchParams.get("grade");
      const schoolStageParam = url.searchParams.get("school_stage");
      const perPageParam = url.searchParams.get("perPage");

      const grade = gradeParam ? Number(gradeParam) : undefined;
      const school_stage = schoolStageParam || undefined;
      const perPage = perPageParam ? Number(perPageParam) : undefined;

      // 高校3年でフィルタした場合は mockStudent One のみ返す
      if (grade === 3 && school_stage === "high_school") {
        return HttpResponse.json(
          {
            students: [studentsMock[0]], // mockStudent One のみ
            meta: {
              total_count: 1,
              per_page: 10,
              current_page: 1,
              total_pages: 1,
            },
          },
          { status: 200 }
        );
      } else if (perPage === 20) {
        return HttpResponse.json(
          {
            students: studentsMock,
            meta: {
              total_count: 2,
              per_page: 20,
              current_page: 1,
              total_pages: 1,
            },
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          {
            students: studentsMock,
            meta: mockMeta,
          },
          { status: 200 }
        );
      }
    }
  ),
  // 生徒作成のハンドラー
  http.post<never, StudentCreateRequestBodyType, StudentCreateResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/students`,
    async ({ request }) => {
      const body = await request.json();

      // 成功時のレスポンス
      return HttpResponse.json(
        {
          ...mockStudent4,
          name: body.name,
          grade: body.grade,
          school_stage: body.school_stage,
          status: body.status,
          joined_on: body.joined_on,
          desired_school: null,
        },
        { status: 201 }
      );
    }
  ),
  http.patch<
    StudentUpdatePathParams,
    StudentUpdateRequestBodyType,
    StudentUpdateResponseBodyType
  >(`${VITE_API_BASE_URL}/api/v1/students/:id`, async ({ params, request }) => {
    const body = await request.json();
    const { id } = params;

    // 成功時のレスポンス
    return HttpResponse.json(
      {
        ...mockStudent1,
        id: Number(id),
        name: body.name,
        grade: body.grade,
        school_stage: body.school_stage,
        status: body.status,
        joined_on: body.joined_on,
        desired_school: null,
      },
      { status: 200 }
    );
  }),
  http.delete<StudentUpdatePathParams, never, StudentUpdateResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/students/:id`,
    async ({ params }) => {
      const { id } = params;

      if (id === "1") {
        return new HttpResponse(null, { status: 204 });
      } else {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                message: "生徒が見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      }
    }
  ),
  // 生徒単体取得のハンドラー
  http.get<StudentDetailPathParams, never, StudentDetailResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/dashboards/:id`,
    async ({ params }) => {
      const { id } = params;

      if (id === "1") {
        return HttpResponse.json(studentDetailMock, { status: 200 });
      } else {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                message: "生徒が見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      }
    }
  ),

  // 授業引継ぎ一覧取得のハンドラー
  http.get<
    never,
    LessonNoteFetchRequestBodyType,
    LessonNoteFetchResponseBodyType
  >(`${VITE_API_BASE_URL}/api/v1/lesson_notes`, async ({ request }) => {
    const url = new URL(request.url);
    const studentIdParam = url.searchParams.get("student_id");
    const subjectIdParam = url.searchParams.get("subject_id");
    const perPageParam = url.searchParams.get("perPage");

    const student_id = studentIdParam ? Number(studentIdParam) : undefined;
    const subject_id = subjectIdParam ? Number(subjectIdParam) : undefined;
    const perPage = perPageParam ? Number(perPageParam) : undefined;

    // mockStudent1(id:1)でsubject_id が1(英語の場合)
    if (student_id === 1 && subject_id === 1) {
      return HttpResponse.json(
        {
          lesson_notes: lessonNotesMock,
          meta: {
            total_count: 2,
            per_page: 5,
            current_page: 1,
            total_pages: 1,
          },
        },
        { status: 200 }
      );
    } else if (perPage === 10) {
      return HttpResponse.json(
        {
          lesson_notes: lessonNotesMock,
          meta: {
            total_count: 2,
            per_page: 10,
            current_page: 1,
            total_pages: 1,
          },
        },
        { status: 200 }
      );
    } else if (student_id !== 1) {
      return HttpResponse.json(
        {
          errors: [
            {
              code: "NOT_FOUND",
              field: "base",
              message: "この科目の授業引継ぎノートは見つかりませんでした。",
            },
          ],
        },
        { status: 404 }
      );
    }
  }),
  // 授業引継ぎノート作成のハンドラー
  http.post<
    never,
    LessonNoteCreateRequestBodyType,
    LessonNoteCreateResponseBodyType
  >(`${VITE_API_BASE_URL}/api/v1/lesson_notes`, async ({ request }) => {
    const body = await request.json();
    const { title, subject_id, note_type, expire_date } = body;

    // モックデータを使ってレスポンスを返す
    return HttpResponse.json(
      {
        id: 4,
        title: title,
        description: body.description,
        note_type: note_type,
        created_by_name: currentAdminUser.name,
        last_updated_by_name: null,
        expire_date: expire_date,
        created_by: {
          id: currentAdminUser.id,
          name: currentAdminUser.name,
        },
        last_updated_by: null,
        student_class_subject: {
          id: 1,
          class_subject: {
            id: subject_id,
            name: "english",
          },
        },
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
      { status: 201 }
    );
  }),
  // 授業引継ぎノート削除のハンドラー
  http.delete<
    LessonNoteDeletePathParams,
    LessonNoteDeleteRequestBodyType,
    LessonNoteDeleteResponseBodyType
  >(
    `${VITE_API_BASE_URL}/api/v1/lesson_notes/:id`,
    async ({ request, params }) => {
      const { id } = params;
      const url = new URL(request.url);
      const studentIdParam = url.searchParams.get("student_id");
      const studentId = studentIdParam ? Number(studentIdParam) : undefined;

      if (id === "1" && studentId === 1) {
        return HttpResponse.json(null, { status: 204 });
      }
    }
  ),
  // 授業引継ぎノート更新のハンドラー
  http.patch<
    LessonNoteUpdatePathParams,
    LessonNoteCreateRequestBodyType,
    LessonNoteCreateResponseBodyType
  >(
    `${VITE_API_BASE_URL}/api/v1/lesson_notes/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      const { title, subject_id, note_type, expire_date } = body;

      // モックデータを使ってレスポンスを返す
      return HttpResponse.json(
        {
          id: Number(id),
          title: title,
          description: body.description,
          note_type: note_type,
          created_by_name: currentAdminUser.name,
          last_updated_by_name: currentAdminUser.name,
          expire_date: expire_date,
          created_by: {
            id: currentAdminUser.id,
            name: currentAdminUser.name,
          },
          last_updated_by: {
            id: currentAdminUser.id,
            name: currentAdminUser.name,
          },
          student_class_subject: {
            id: 1,
            class_subject: {
              id: subject_id,
              name: "english",
            },
          },
          created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
        { status: 201 }
      );
    }
  ),
  // 生徒特性一覧取得のハンドラー
  http.get<never, StudentTraitsRequestBodyType, StudentTraitsResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/student_traits`,
    async ({ request }) => {
      const url = new URL(request.url);
      const studentIdParam = url.searchParams.get("student_id");
      const perPageParam = url.searchParams.get("perPage");

      const student_id = studentIdParam ? Number(studentIdParam) : undefined;
      const perPage = perPageParam ? Number(perPageParam) : undefined;

      // mockStudent1(id:1)の場合
      if (student_id === 1) {
        return HttpResponse.json(
          {
            student_traits: mockStudentTraits,
            meta: {
              total_count: 10,
              per_page: 10,
              current_page: 1,
              total_pages: 1,
            },
          },
          { status: 200 }
        );
        // 指導していない生徒の場合
      } else if (perPage === 20) {
        return HttpResponse.json(
          {
            student_traits: mockStudentTraits,
            meta: {
              total_count: 10,
              per_page: 20,
              current_page: 1,
              total_pages: 1,
            },
          },
          { status: 200 }
        );
      } else if (student_id !== 1) {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                field: "base",
                message: "生徒が見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      }
    }
  ),
  // 生徒特性作成のハンドラー
  http.post<
    never,
    StudentTraitCreateRequestBodyType,
    StudentTraitCreateResponseBodyType
  >(`${VITE_API_BASE_URL}/api/v1/student_traits`, async ({ request }) => {
    const body = await request.json();
    const { title, category } = body;

    // モックデータを使ってレスポンスを返す
    return HttpResponse.json(
      {
        id: 11,
        title: title,
        description: body.description,
        category: category,
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
      { status: 201 }
    );
  }),
  // 生徒特性の削除のハンドラー
  http.delete<
    StudentTraitDeletePathParams,
    StudentTraitDeleteRequestBodyType,
    StudentTraitDeleteResponseBodyType
  >(
    `${VITE_API_BASE_URL}/api/v1/student_traits/:id`,
    async ({ request, params }) => {
      const { id } = params;
      const url = new URL(request.url);
      const studentIdParam = url.searchParams.get("student_id");
      const studentId = studentIdParam ? Number(studentIdParam) : undefined;

      if (id === "1" && studentId === 1) {
        return HttpResponse.json(null, { status: 204 });
      }
    }
  ),
  // 生徒特性の更新のハンドラー
  http.patch<
    StudentTraitUpdatePathParams,
    StudentTraitUpdateRequestBodyType,
    StudentTraitUpdateResponseBodyType
  >(
    `${VITE_API_BASE_URL}/api/v1/student_traits/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      const { title, category } = body;
      return HttpResponse.json(
        {
          id: Number(id),
          title: title,
          description: body.description,
          category: category,
          created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
        { status: 200 }
      );
    }
  ),
];
