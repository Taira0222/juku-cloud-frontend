import { server } from '@/tests/fixtures/server/server';
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(() => {
  server.listen();
});
// リセットハンドラーを使用して、各テストの後にサーバーの状態をリセットします。
afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
