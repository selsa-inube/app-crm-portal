const MaritalStatus = {
  Married: "married",
  Single: "single",
  Divorced: "divorced",
  Widowed: "widowed",
} as const;

const EconomicActivity = {
  Pensioner: "pensioner",
  Employed: "employed",
  Unemployed: "unemployed",
  Student: "student",
} as const;

export { MaritalStatus, EconomicActivity };
