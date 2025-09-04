import Feature from "../../models/feature.model.js";

export const addFeatureImage = async (req, res) => {
    console.log(typeof(req.body.image));
    try {
        const {image} = req.body;

        const featureImages = new Feature({image});

        await featureImages.save();

        res.status(200).json({ data: featureImages });
        
    } catch (error) {
        console.log("Error in add feature image controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeatureImages = async (req, res) => {
    try {
        const images = await Feature.find({});

        res.status(200).json({ data: images });
        
    } catch (error) {
        console.log("Error in get feature images controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};