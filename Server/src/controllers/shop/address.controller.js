import Address from "../../models/address.model.js";

export const addAddress = async (req, res) => {
    try {
        const {userId, formData} = req.body;
        const {address, city, pincode, phone, notes} = formData;

        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const newlyCreatedAddress = new Address({
            userId, address, city, pincode, phone, notes
        });

        await newlyCreatedAddress.save();

        res.status(200).json({ data: newlyCreatedAddress });

    } catch (error) {
        console.log("Error in add address controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchAllAddress = async (req, res) => {
    try {
        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({ message: "User id is required" });
        }

        const addressList = await Address.find({userId});

        res.status(200).json({ data: addressList });

    } catch (error) {
        console.log("Error in fetch all addresses controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const editAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.params;
        const formData = req.body;

        if(!userId || !addressId){
            return res.status(400).json({ message: "User and address id is required" });
        }

        const address = await Address.findOneAndUpdate({
            _id: addressId, userId
        }, formData, {new: true});

        if(!address){
            return res.status(400).json({ message: "Address not found" });
        }

        res.status(200).json({ data: address });

    } catch (error) {
        console.log("Error in edit address controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.params;

        if(!userId || !addressId){
            return res.status(400).json({ message: "User and address id is required" });
        }

        const address = await Address.findOneAndDelete({ _id: addressId, userId });

        if(!address){
            return res.staus(400).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address deleted successfully" });

    } catch (error) {
        console.log("Error in delete address controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};