import express from "express";
import { addProduct, deleteProduct, editProduct, fetchProducts, handleUploadImage } from "../../controllers/admin/products.controller.js";
import { upload } from "../../utils/cloudinary.util.js";

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleUploadImage);
router.post("/add", addProduct);
router.get("/get", fetchProducts);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

export default router;