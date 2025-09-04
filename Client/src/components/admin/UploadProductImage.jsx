import { useEffect, useRef } from "react";
import { CloudUpload, File, X } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";


const UploadProductImage = ({ imageFile, setImageFile, isEditMode, setFormData }) => {
    const inputRef = useRef(null);

    const { uploadImage, isImageLoading } = useAdminStore();

    const handleImageFileChange = (e) => {
        console.log(e.target.files);
        const selectedFile = e.target.files?.[0];
        if(selectedFile) {
            setImageFile(selectedFile);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if(droppedFile) {
            setImageFile(droppedFile);
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        if(inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const uploadImageToCloudinary = async () => {
        const data = new FormData();
        data.append("my_file", imageFile);
        try {
            const imageUrl = await uploadImage(data);
            console.log("Image uploaded successfully:", imageUrl);
            if(imageUrl) {
                setFormData((prevData) => ({
                    ...prevData,
                    image: imageUrl
                }));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    }

    useEffect(() => {
        if(imageFile !== null) {
            uploadImageToCloudinary();
        }
    }, [imageFile])

    return (
        <div className="form-control">
            <label className="label mb-1">
                <span className="label-text font-medium text-sm">Upload Image</span>
            </label>
            <div 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
                className={`${isEditMode ? 'opacity-60' : ''} border border-dashed rounded-lg border-gray-300 p-4`}
            >
                <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden file-input" 
                    ref={inputRef} 
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                 />
                {
                    !imageFile ? (
                        <label 
                            htmlFor="image-upload" 
                            className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-col justify-center 
                            items-center h-32`}
                        >
                            <CloudUpload className="w-10 h-10 mb-2 text-gray-500" />
                            <span className="text-center text-xs">Drag & drop or click to upload image</span>
                        </label>
                    ) : (
                        isImageLoading ? (
                            <div className="skeleton h-10 bg-gray-100"></div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <File className="w-8 text-black mr-2 h-8" />
                                </div>
                                <p className="text-sm font-medium">{imageFile.name}</p>
                                <button className="btn btn-ghost btn-sm" onClick={handleRemoveImage}>
                                    <X className="w-4 h-4" />
                                    <span className="sr-only">Remove File</span>
                                </button>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
};

export default UploadProductImage;
