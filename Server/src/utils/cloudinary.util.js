import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import multer  from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

export const uploadImageUtil = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: `${process.env.CLOUDINARY_FOLDER_NAME}/`,
            resource_type: 'auto'
        });

        return result;
        
    } catch (error) {
        console.error("Cloudinary upload error:", err);
        throw err;
    }
}

export const upload = multer({storage});
