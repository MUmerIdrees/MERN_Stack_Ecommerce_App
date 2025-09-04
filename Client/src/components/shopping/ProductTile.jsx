const ShoppingProductTile = ({ product, handleGetProductDetails, handleAddToCart }) => {
    return (
        <div className="card w-full max-w-sm mx-auto shadow-md shadow-gray-200 bg-gray-200">
            <div>
                <figure>
                    <div className="relative w-full">
                        <img 
                            src={product?.image} 
                            alt={product?.title} 
                            className="w-full h-[300px] object-cover rounded-t-lg"
                        />
                        {
                            product?.totalStock === 0 ? 
                            <span className="badge absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white border-none">
                                Out Of Stock
                            </span> : 
                            product?.totalStock < 10 ?
                            <span className="badge absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white border-none">
                                {`Only ${product?.totalStock} items left`}
                            </span> :
                            product?.salePrice > 0 ? 
                            <span className="badge absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-white border-none">
                                Sale
                            </span> : null
                        }
                        <button
                            onClick={() => handleGetProductDetails(product?._id)}
                            className="absolute bottom-2 right-2 px-3 py-1 text-sm text-white bg-gray-600 hover:bg-gray-700 rounded shadow transition-opacity duration-200 opacity-90 group-hover:opacity-100 cursor-pointer"
                        >
                            View Details
                        </button>
                    </div>
                </figure>
            </div>
            <div className="card-body p-4 bg-white">
                <h2 className="card-title font-bold mb-2">{product?.title}</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">{product?.category}</span>
                    <span className="text-sm text-gray-300">{product?.brand}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className={`${product?.salePrice > 0 ? 'line-through' : '' } text-[16px] text-black font-semibold`}>
                        RS{product?.price}
                    </span>
                    {
                        product?.salePrice > 0 ? 
                        <span className="text-[16px] text-black font-semibold">RS{product?.salePrice}</span> : null
                    }
                </div>
                <div className="card-actions">
                    {
                        product?.totalStock === 0 ? 
                        <button className="btn btn-neutral w-full opacity-60 cursor-not-allowed">
                            Out Of Stock
                        </button> : 
                        <button onClick={() => handleAddToCart(product?._id, product?.totalStock)} className="btn btn-neutral w-full">
                            Add to cart
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ShoppingProductTile;
