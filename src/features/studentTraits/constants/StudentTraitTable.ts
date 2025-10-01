export const TRAITS_COLUMNS = [
  {
    id: 1,
    value: "all",
    name: "すべて",
  },
  {
    id: 2,
    value: "good",
    name: "よい特性",
  },
  {
    id: 3,
    value: "careful",
    name: "注意が必要な特性",
  },
] as const;

export const HEADER_COLOR_BY_TRAIT = {
  all: "bg-muted",
  good: "bg-emerald-100",
  careful: "bg-amber-100",
} satisfies Record<(typeof TRAITS_COLUMNS)[number]["value"], string>;
