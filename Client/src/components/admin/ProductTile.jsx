const ProductTile = ({ product, setCurrentEditedId, setOpenAddProductBox, setFormData, handleDeleteProduct }) => {
    return (
        <div className="card w-full max-w-sm shadow-sm bg-gray-100">
            <figure>
                <img
                    src={product?.image}
                    alt={product?.title} 
                    className="w-full h-[300px] object-cover rounded-t-lg"
                />
            </figure>
            <div className="card-body bg-white">
                <h2 className="card-title">{product?.title}</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-black`}>
                        RS{product?.price}
                    </span>
                    {product?.salePrice > 0 && (
                        <span className="text-lg font-semibold">
                            RS{product?.salePrice}
                        </span>
                    )}
                </div>
                <div className="card-actions flex justify-between items-center">
                    <button 
                        onClick={
                            () => {
                                setOpenAddProductBox(true);
                                setCurrentEditedId(product?._id);
                                setFormData(product);
                            }
                        } 
                        className="btn btn-neutral"
                    >
                        Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-error">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ProductTile;
