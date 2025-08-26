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

const noop = () => {};

// ブラウザにあるが、happydom にはないhasPointerCapture, setPointerCapture, releasePointerCaptureのダミーを作成
// hasPointerCapture は boolean の返り値が必要なのでfalse にする
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = noop;
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = noop;
}
