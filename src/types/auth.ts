// FullHeadersは、APIからのレスポンスヘッダーを表す型です。
export type FullHeaders = {
  'x-frame-options': string;
  'x-xss-protection': string;
  'x-content-type-options': string;
  'x-permitted-cross-domain-policies': string;
  'referrer-policy': string;
  'content-type': string;
  vary: string;
  'access-token': string;
  'token-type': string;
  client: string;
  expiry: string;
  uid: string;
  authorization: string;
  etag: string;
  'cache-control': string;
  'x-request-id': string;
  'x-runtime': string;
  'content-length': string;
};

// AuthHeaderは、認証に必要なヘッダー情報を抽出した型です。
export type AuthHeader = {
  'access-token': string;
  client: string;
  uid: string;
  'token-type': string;
  expiry: string;
};

// LoginSuccessResponseは、Railsでいうresponse.body の部分です。
export type LoginSuccessResponse = {
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

// LoginErrorResponseは、railsでいうresponse.body の部分です。
export type LoginErrorResponse = {
  success: boolean;
  errors: Array<string>;
};
