const status = ["valid", "invalid", "pending"] as const;
export type Status = (typeof status)[number];

export const sizes = ["wide", "compact"] as const;
export type Size = (typeof sizes)[number];
