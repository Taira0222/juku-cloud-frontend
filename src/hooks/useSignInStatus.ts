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

export const useSignInStatus = (signInAt: string | null): StatusMeta => {
  if (!signInAt) {
    return {
      label: '未ログイン',
      colorClass: 'text-muted-foreground',
      Icon: IconCircle,
    };
  }
  // 直近のサインイン(ISO8601)をミリ秒に変換
  const last = new Date(signInAt).getTime();
  const now = Date.now();
  // 現在と直近のサインインの差を計算し、日数に変換(少数切り捨て整数)
  const diffMinutes = Math.floor((now - last) / (1000 * 60));
  const diffHours = Math.floor((now - last) / (1000 * 60 * 60));
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  // 1時間以内なら分単位で表示
  if (diffMinutes < 60) {
    return {
      label: `${diffMinutes}分前`,
      colorClass: 'text-emerald-500',
      Icon: IconCircleFilled,
    };
  }

  // 1時間以上12時間以内なら時間単位
  if (diffHours <= 12) {
    return {
      label: `${diffHours}時間前`,
      colorClass: 'text-emerald-500',
      Icon: IconCircleFilled,
    };
  }

  // 12時間より上で24時間以内なら24時間以内で固定
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
  } else if (diffDays <= 31) {
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
