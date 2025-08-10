// AuthHeaderは、認証に必要なヘッダー情報を抽出した型です。
export type AuthHeader = {
  'access-token': string;
  client: string;
  uid: string;
  'token-type': string;
  expiry: string;
};

// SignInSuccessResponseは、Railsでいうresponse.body の部分です。
export type SignInSuccessResponse = {
  data: {
    email: string;
    provider: string;
    uid: string;
    id: number;
    allow_password_change: boolean;
    name: string;
    role: 'teacher' | 'admin';
    school_stage: 'bachelor' | 'master';
    grade: number;
    graduated_university: string;
  };
};

// SignInErrorResponseは、railsでいうresponse.body の部分です。
export type SignInErrorResponse = {
  success: boolean;
  errors: string[];
};
