import { useEffect, useState } from "react";
import UploadProductImage from "../../components/admin/UploadProductImage";
import { useFeatureStore } from "../../store/useFeatureStore";
import { Loader2 } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";

const AdminDashboard = () => {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const { isAddingFeatureImage, addFeatureImage } = useFeatureStore();
    const { fetchDashboardData, dashboardData } = useAdminStore();

    const handleUploadFeatureImage = async () => {
        await addFeatureImage(uploadedImageUrl.image);
        setImageFile(null);
        setUploadedImageUrl('');
    }

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <div>
            {dashboardData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                    <div className="card shadow-sm shadow-gray-300">
                        <div className="card-body">
                            <h2 className="card-title">Total Users</h2>
                            <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
                        </div>
                    </div>
                    <div className="card shadow-sm shadow-gray-300">
                        <div className="card-body">
                            <h2 className="card-title">Total Orders</h2>
                            <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
                        </div>
                    </div>
                    <div className="card shadow-sm shadow-gray-300">
                        <div className="card-body">
                            <h2 className="card-title">Total Products</h2>
                            <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
                        </div>
                    </div>
                    <div className="card shadow-sm shadow-gray-300">
                        <div className="card-body">
                            <h2 className="card-title">Total Revenue</h2>
                            <p className="text-2xl font-bold">{`RS${dashboardData.totalRevenue.toFixed(2)}`}</p>
                        </div>
                    </div>
                </div>
            )}
            <UploadProductImage
                imageFile={imageFile} 
                setImageFile={setImageFile}
                setFormData={setUploadedImageUrl}
            />
            <button onClick={handleUploadFeatureImage} className="btn btn-neutral mt-5 w-full" disabled={isAddingFeatureImage}>
                {
                    isAddingFeatureImage ?
                    <>
                        <Loader2 className="size-5 animate-spin" />
                        Loading...
                    </> : 
                    'Upload'
                }
            </button>
        </div>
    );
};

export default AdminDashboard;
