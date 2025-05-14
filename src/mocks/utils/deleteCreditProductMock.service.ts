import { updateActive } from "@mocks/utils/dataMock.service";
import { ICreditProduct } from "@services/prospects/types";

export async function deleteCreditProductMock(
  id: string,
  selectedProductId: string | null,
  prospectProducts: ICreditProduct[],
  setProspectProducts: React.Dispatch<React.SetStateAction<ICreditProduct[]>>,
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
