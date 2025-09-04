import { Loader2, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import UploadProductImage from "../../components/admin/UploadProductImage";
import { useAdminStore } from "../../store/useAdminStore";
import ProductTile from "../../components/admin/ProductTile";

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
};

const AdminProducts = () => {
    const [openAddProductBox, setOpenAddProductBox] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { addProduct, isAddingProduct, productsList, fetchProducts, isEditingProduct, editProduct, deleteProduct } = useAdminStore();

    const isFormValid = () => {
        return formData.image && formData.title && formData.description && formData.category && formData.brand && 
        formData.price && formData.totalStock;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(currentEditedId === null) {
            await addProduct(formData);
            await fetchProducts();
            setFormData(initialFormData);
            setImageFile(null);
            setOpenAddProductBox(false);
        } else {
            await editProduct(currentEditedId, formData);
            await fetchProducts();
            setFormData(initialFormData);
            setImageFile(null);
            setOpenAddProductBox(false);
            setCurrentEditedId(null);
        }
    }

    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId);
        await fetchProducts();
    }

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <button onClick={() => setOpenAddProductBox(true)} className="btn btn-neutral rounded-md px-4 py-2">
                    Add New Product
                </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {productsList && productsList.length > 0 ? (
                    productsList.map((product) => (
                        <ProductTile 
                            key={product?.title}  
                            product={product} 
                            setCurrentEditedId={setCurrentEditedId}
                            setOpenAddProductBox={setOpenAddProductBox}
                            setFormData={setFormData}
                            handleDeleteProduct={handleDeleteProduct}
                        />
                ))) : (
                    <div className="text-start text-gray-500 col-span-full">
                        No products found.
                    </div>
                )}
            </div>
            {openAddProductBox && (
                <div className="fixed inset-0 z-40">
                    {/*overlay*/}
                    <div 
                        className="absolute inset-0 bg-gray-700/60" 
                        onClick={
                            () => {
                                setOpenAddProductBox(false);
                                setCurrentEditedId(null);
                                setFormData(initialFormData);
                            }
                        }
                    >
                    </div>
                    <div className="fixed top-0 right-0 z-50 w-80 h-screen overflow-y-auto bg-white border-l border-l-gray-200 pb-5 transform transition-transform duration-300 translate-x-0">
                        {/* Close button */}
                        <div className="flex justify-end py-3">
                            <button 
                                onClick={
                                    () => {
                                        setOpenAddProductBox(false);
                                        setFormData(initialFormData);
                                        setCurrentEditedId(null);
                                        setImageFile(null);
                                    }
                                }
                                className="btn btn-ghost btn-sm pr-4"
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex gap-2 mt-1 mb-3 pl-5">
                            <h1 className="text-xl font-medium text-black">
                                {currentEditedId ? 'Edit Product' : 'Add New Product'}
                            </h1>
                        </div>
                        <div className="w-full max-w-sm px-5 pb-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <UploadProductImage
                                    imageFile={imageFile} 
                                    setImageFile={setImageFile}
                                    setFormData={setFormData}
                                    isEditMode={currentEditedId !== null}
                                />
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Title</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter product title" 
                                        className="input w-full text-sm focus:border-none" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Description</span>
                                    </label>
                                    <textarea 
                                        className="textarea w-full text-sm focus:border-none" 
                                        placeholder="Enter product description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                                        required
                                    >
                                    </textarea>
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Category</span>
                                    </label>
                                    <select 
                                        className="select w-full text-sm focus:border-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>Category</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Footwear">Footwear</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Brand</span>
                                    </label>
                                    <select 
                                        className="select w-full text-sm focus:border-none"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>Brand</option>
                                        <option value="Nike">Nike</option>
                                        <option value="Adidas">Adidas</option>
                                        <option value="Puma">Puma</option>
                                        <option value="Levi's">Levi's</option>
                                        <option value="Zara">Zara</option>
                                        <option value="H&M">Hopscotch</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Price</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter product price" 
                                        className="input w-full text-sm focus:border-none" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Sale Price</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter sale price (optional)" 
                                        className="input w-full text-sm focus:border-none" 
                                        value={formData.salePrice}
                                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value})}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1">
                                        <span className="label-text font-medium text-sm">Total Stock</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter total stock" 
                                        className="input w-full text-sm focus:border-none"
                                        value={formData.totalStock} 
                                        onChange={(e) => setFormData({ ...formData, totalStock: e.target.value})}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-neutral w-full" 
                                    disabled={
                                        currentEditedId ? isEditingProduct : isAddingProduct ||
                                        !currentEditedId && !isFormValid()
                                    }
                                >
                                    {(currentEditedId ? isEditingProduct : isAddingProduct) ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        currentEditedId ? 'Edit' : 'Add'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default AdminProducts;
