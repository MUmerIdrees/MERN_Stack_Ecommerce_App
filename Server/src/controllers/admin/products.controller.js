import { uploadImageUtil } from "../../utils/cloudinary.util.js";
import Product from "../../models/product.model.js";

export const handleUploadImage = async (req, res) => {
    try {
        const b64 = req.file.buffer.toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await uploadImageUtil(url);

        res.status(200).json({ result });
        
    } catch (error) {
        console.log("Error in upload image controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;

        const newProduct = new Product({
            image,
            title, 
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        });

        await newProduct.save();

        res.status(200).json({message: "Product add in database successfully", data: newProduct});
        
    } catch (error) {
        console.log("Error in add product controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const fetchProducts = async (req, res) => {
    try {
        const productsList = await Product.find({});
        res.status(200).json({message: "Products fetch successfully", data: productsList});

    } catch (error) {
        console.log("Error in fetch products controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;

        const findProduct = await Product.findById(id);
        if(!findProduct) {
            return res.status(400).json({message: 'Product not found'});
        }

        findProduct.image = image || findProduct.image;
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price || findProduct.price;
        findProduct.salePrice = salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;

        await findProduct.save();

        res.status(200).json({message: "Product edited successfuly", data: findProduct});

    } catch (error) {
        console.log("Error in edit product controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(400).json({message: 'Product not found'});
        }

        res.status(200).json({message: "Product deleted successfully"});
        
    } catch (error) {
        console.log("Error in delete product controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}