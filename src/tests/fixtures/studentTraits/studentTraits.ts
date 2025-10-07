import type { StudentTraitType } from "@/features/studentTraits/types/studentTraits";
import { format } from "date-fns";

export const mockStudentTraits: StudentTraitType[] = [
  {
    id: 1,
    title: "勉強の重要性を理解し積み重ねて学習しようとする姿勢がある",
    description: "勉強の重要性を理解し、日々の学習を積み重ねていく姿勢がある",
    category: "good",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 2,
    title: "明るい",
    description: "いつもニコニコしている。",
    category: "good",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 3,
    title: "負けず嫌い",
    description: "自分に厳しく、他人と競うことが好き。",
    category: "good",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 4,
    title: "努力家",
    description: "目標に向かってコツコツと努力を続けられる。",
    category: "good",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 5,
    title: "再現性が高い",
    description: "数学などの計算で、公式や解法を正確に覚えて安定して解ける。",
    category: "good",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },

  // ---- careful (5) ----
  {
    id: 6,
    title: "宿題をやったふりをしてしまう",
    description: "実際にはやっていないのに、やったと言ってしまうことがある。",
    category: "careful",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 7,
    title: "集中力が続かない",
    description: "勉強中に気が散りやすく、集中が途切れやすい。",
    category: "careful",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 8,
    title: "親にやらされている感が強い",
    description:
      "学習動機が外発的で、親に言われたから勉強しているという気持ちが強い。",
    category: "careful",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 9,
    title: "人に流されやすい",
    description: "周囲の意見に影響されやすく、自分の意見を持ちづらい。",
    category: "careful",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: 10,
    title: "完璧主義すぎる",
    description: "小さなミスでも過度に落ち込み、先に進めなくなることがある。",
    category: "careful",
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
];
