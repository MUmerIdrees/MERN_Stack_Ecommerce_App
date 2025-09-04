import Product  from "../../models/product.model.js";

export const getFilteredProducts = async (req, res) => {
    try {
        const { category = "", brand = "", sortBy = "price-lowtohigh"} = req.query;

        let filters = {};

        if(category){
            const categoryArray = category.split(",").map(item => 
                item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
            );
            filters.category = {$in: categoryArray};
        }
        if(brand){
            const brandArray = brand.split(",").map(item => 
                item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
            );
            filters.brand = {$in: brandArray};
        }

        let sort = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1
                break;
            case 'price-hightolow':
                sort.price = -1
                break;
            case 'title-atoz':
                sort.title = 1
                break;
            case 'title-ztoa':
                sort.title = -1
                break;
            default:
                sort.price = 1
                break;
        }

        const products = sort && Object.keys(sort).length > 0 ? await Product.find(filters).sort(sort) : await Product.find(filters);

        res.status(200).json({
            message: "Products fetched successfully",
            data: products,
        });
        
    } catch (error) {
        console.error("Error in getFilteredProducts controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if(!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        res.status(200).json({ data: product });
        
    } catch (error) {
        console.error("Error in getProductDetails controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};