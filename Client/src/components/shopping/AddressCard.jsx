const AddressCard = ({addressInfo, handleDeleteAddress, setCurrentEditedId, setFormData, setCurrentSelectedAddress, selectedId}) => {
    return (
        <div 
            onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null} 
            className={`card shadow-sm shadow-gray-300 cursor-pointer 
                ${selectedId === addressInfo?._id ? 'border-black border-2' : ''}`}
        >
            <div className="card-body grid gap-4 p-4">
                <label>Address: {addressInfo?.address}</label>
                <label>City: {addressInfo?.city}</label>
                <label>Phone: {addressInfo?.phone}</label>
                <label>Pincode: {addressInfo?.pincode}</label>
                <label>Notes: {addressInfo?.notes}</label>
            </div>
            <div className="card-actions flex justify-between p-4">
                <button 
                    onClick={
                        () => {
                            setCurrentEditedId(addressInfo?._id);
                            setFormData(addressInfo);
                        }
                    }
                    className="btn btn-sm btn-neutral"
                >
                        Edit
                </button>
                <button onClick={() => handleDeleteAddress(addressInfo)} className="btn btn-sm btn-error">Delete</button>
            </div>
        </div>
    );
};

export default AddressCard;
