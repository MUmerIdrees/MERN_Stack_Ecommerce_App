import Product from "../../models/product.model.js";

export const searchProducts = async (req, res) => {
    try {
        const {keyword} = req.params;
        if(!keyword || typeof keyword !== 'string'){
            return res.status(400).json({ message: "Keyword is required and must be in string format" });
        }

        const regExPartial = new RegExp(keyword, 'i'); // For title & description
        const regExExact = new RegExp(`^${keyword}$`, 'i'); // Exact match for category & brand

        const categoryRegex = (keyword.toLowerCase() === "men" || keyword.toLowerCase() === "women")
            ? regExExact
            : regExPartial;

        const createSearchQuery = {
            $or: [
                { title: regExPartial },
                { description: regExPartial },
                { category: categoryRegex },
                { brand: regExPartial }
            ]
        };

        const searchResults = await Product.find(createSearchQuery);

        res.status(200).json({ data: searchResults });
        
    } catch (error) {
        console.log("Error in search products controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};