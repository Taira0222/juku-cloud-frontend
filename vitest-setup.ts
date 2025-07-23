import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './src/tests/mocks/server';

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
