import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cartId: {
            type: String,
        },
        cartItems: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                }, 
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
        addressInfo: {
            addressId: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            }, 
            pincode: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            }, 
            notes: {
                type: String,
            }
        },
        orderStatus: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        orderDate: {
            type: Date,
            required: true,
        },
        orderUpdateDate: {
            type: Date,
        },
        paymentId: {
            type: String,
        },
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;