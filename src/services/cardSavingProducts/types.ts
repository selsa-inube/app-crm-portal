export interface IAllInternal {
  cardSavingProductId: string;
  savingProductNumber: string;
  savingProductCode: string;
  customerCode: string;
  customerName: string;
  creationDate: string;
  productCode: string;
  productDescription: string;
  productCatalogCode: string;
  productCatalogName: string;
  branchCode: string;
  branchName: string;
  cardSavingProductStatus: string;
  availableFor: {
    code: string;
    description: string;
    i18nAttribute: string;
  };
  cardsUseTheProduct: [
    {
      numberCard: string;
    },
  ];
}
