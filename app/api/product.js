import client from "./client";

const endpoint = "/product";

const getAllProductsInBranch = (branchId) =>
  client.get(endpoint + "/branch/" + branchId);

const newProduct = (name, barcode, branchId) =>
  client.post(endpoint, { name, barcode, branchId });

const deleteProduct = (productId) => client.delete(endpoint + "/" + productId);

const findById = (branchId, barcode) =>
  client.post(endpoint + "/findByBarcode", { branchId, barcode });

export default {
  getAllProductsInBranch,
  newProduct,
  deleteProduct,
  findById,
};
