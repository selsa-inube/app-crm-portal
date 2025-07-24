const ruleFinancialObligationsUpdateRequired = [
  {
    name: "FinancialObligationsUpdateRequired",
    dataType: "Alphabetical",
    value: "N",
    valueUse: "EqualTo",
    startDate: "2025-06-03T00:00:00Z",
    typeDecision: "Permanent",
    conditions: [
      {
        name: "LineOfCredit",
        dataType: "Alphabetical",
        value: "Hogar",
        valueUse: "EqualTo",
      },
      {
        name: "ClientType",
        dataType: "Alphabetical",
        value: "1",
        valueUse: "EqualTo",
      },
    ],
  },
  {
    name: "FinancialObligationsUpdateRequired",
    dataType: "Alphabetical",
    value: "N",
    valueUse: "EqualTo",
    startDate: "2025-06-03T00:00:00Z",
    typeDecision: "Permanent",
    conditions: [
      {
        name: "LineOfCredit",
        dataType: "Alphabetical",
        value: "Hogar",
        valueUse: "EqualTo",
      },
      {
        name: "ClientType",
        dataType: "Alphabetical",
        value: "1",
        valueUse: "EqualTo",
      },
    ],
  },
];

export { ruleFinancialObligationsUpdateRequired };
