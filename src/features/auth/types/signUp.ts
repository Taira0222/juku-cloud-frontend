export type SignUpRequestData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_code: string;
};

export type SignUpSuccessResponse = {
  data: {
    id: number;
    provider: string;
    uid: string;
    allow_password_change: boolean;
    name: string;
    role: string;
    school_stage: string | null;
    grade: number | null;
    graduated_university: string | null;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

// 失敗の場合の型定義
export type SignUpErrorResponse = {
  data: {
    id: number | null;
    provider: string;
    uid: string;
    allow_password_change: boolean;
    name: string;
    role: string | null;
    school_stage?: string | null;
    grade?: number | null;
    graduated_university?: string | null;
    email: string;
    created_at: string | null;
    updated_at: string | null;
  };
  errors: {
    [key: string]: string[]; // email, password_confirmation などのフィールドごとのエラー
    full_messages: string[]; // ユーザー向けにまとめたメッセージ
  };
};
