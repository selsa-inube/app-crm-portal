import { updateActive } from "@mocks/utils/dataMock.service";
import { ICreditProductProspect } from "@services/types";

export async function deleteCreditProductMock(
  id: string,
  selectedProductId: string | null,
  prospectProducts: ICreditProductProspect[],
  setProspectProducts: React.Dispatch<
    React.SetStateAction<ICreditProductProspect[]>
  >,
) {
  if (!selectedProductId) return;

  const updatedProducts = prospectProducts.filter(
    (product) => product.credit_product_code !== selectedProductId,
  );
  setProspectProducts(updatedProducts);

  await updateActive({
    key: "public_code",
    nameDB: "prospects",
    identifier: id,
    editData: { credit_product: updatedProducts },
  });
}
