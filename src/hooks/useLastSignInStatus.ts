import {
  IconCircle,
  IconCircleFilled,
  type TablerIcon,
} from '@tabler/icons-react';

type StatusMeta = {
  label: string;
  colorClass: string;
  Icon: TablerIcon;
};

export const useLastSignInStatus = (
  lastSignInAt: string | null
): StatusMeta => {
  if (!lastSignInAt) {
    return {
      label: '未ログイン',
      colorClass: 'text-muted-foreground',
      Icon: IconCircle,
    };
  }
  // 直近のサインイン(ISO8601)をミリ秒に変換
  const last = new Date(lastSignInAt).getTime();
  const now = Date.now();
  // 現在と直近のサインインの差を計算し、日数に変換(少数切り捨て整数)
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      label: '24時間以内',
      colorClass: 'text-emerald-500',
      Icon: IconCircleFilled,
    };
  } else if (diffDays <= 7) {
    return {
      label: `${diffDays}日前`,
      colorClass: 'text-yellow-500',
      Icon: IconCircleFilled,
    };
  } else if (diffDays <= 30) {
    return {
      label: `${diffDays}日前`,
      colorClass: 'text-orange-500',
      Icon: IconCircleFilled,
    };
  } else {
    return {
      label: '1か月以上',
      colorClass: 'text-red-500',
      Icon: IconCircleFilled,
    };
  }
};
