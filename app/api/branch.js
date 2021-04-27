import client from "./client";

const endpoint = "/branch";

const getAllBranches = () => client.get(endpoint);

const newBranch = (name, barcodeAddress) =>
  client.post(endpoint, { name, barcodeAddress });

const updateBranch = (branchId, name, barcodeAddress) =>
  client.put(endpoint + "/" + branchId, { name, barcodeAddress });

const deleteBranch = (branchId) => client.delete(endpoint + "/" + branchId);

const findByBarcode = (barcodeAddress) =>
  client.post(endpoint + "/findByBarcodeAddress", {
    barcodeAddress,
  });

export default {
  getAllBranches,
  newBranch,
  updateBranch,
  deleteBranch,
  findByBarcode,
};
