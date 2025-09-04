import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAddressStore } from "../../store/useAddressStore";
import AddressCard from "../../components/shopping/AddressCard";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const initialFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { authUser } = useAuthStore();
    const { addNewAddress, isAddingAddress, fetchAllAddresses, addressList, deleteAddress, editAddress, isEditingAddress } = useAddressStore();

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        if(addressList.length >= 3 && currentEditedId === null){
            setFormData(initialFormData);
            toast.warning("You can add maxium 3 addresses");
            return;
        }
        if(currentEditedId === null){
            await addNewAddress({ formData, userId: authUser?._id });
            await fetchAllAddresses(authUser?._id);
            setFormData(initialFormData);
        } else {
            await editAddress({ userId: authUser?._id, addressId: currentEditedId, formData });
            await fetchAllAddresses(authUser?._id);
            setFormData(initialFormData);
            setCurrentEditedId(null);
        }
    }

    const isFormValid = () => {
        return formData.address && formData.city && formData.phone && formData.pincode && formData.notes;
    }

    const handleDeleteAddress = async (getCurrentAddress) => {
        await deleteAddress({ userId: authUser?._id, addressId: getCurrentAddress?._id });
        await fetchAllAddresses(authUser?._id);
    }

    useEffect(() => {
        fetchAllAddresses(authUser?._id);
    }, [fetchAllAddresses]);

    return (
        <div className="card">
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {
                    addressList && addressList.length > 0 ?
                    addressList.map((singleAddress) => (
                        <AddressCard 
                            addressInfo={singleAddress} 
                            handleDeleteAddress={handleDeleteAddress} 
                            setCurrentEditedId={setCurrentEditedId}
                            setFormData={setFormData}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                            selectedId={selectedId}
                        />
                    )) : null
                }
            </div>
            <div className="card-body">
                <div className="card-title">
                    {
                        currentEditedId ? 'Edit Address' : 'Add New Address'
                    }
                </div>
                <div className="w-full">
                    <form onSubmit={handleSubmitAddress} className="space-y-3">
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">Address</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter your address" 
                                className="input w-full text-sm focus:border-none" 
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">City</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter your city" 
                                className="input w-full text-sm focus:border-none" 
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">Phone</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter your phone number" 
                                className="input w-full text-sm focus:border-none" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">Pincode</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter your pincode" 
                                className="input w-full text-sm focus:border-none" 
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">Notes</span>
                            </label>
                            <textarea 
                                placeholder="Enter any additional notes" 
                                className="textarea w-full text-sm focus:border-none" 
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value})}
                                required
                            >
                            </textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-neutral w-full" 
                            disabled={!currentEditedId && !isFormValid()}
                        >
                            {
                                (currentEditedId ? isEditingAddress : isAddingAddress) ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    currentEditedId ? 'Edit' : 'Add'
                                )
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Address;
