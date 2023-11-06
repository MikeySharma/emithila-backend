const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    shippingInfo:{
        country:{
            type: String,
            required: true,
        },firstname:{
            type: String,
            required: true,
        },lastname: {
            type: String,
            required: true,
        },address: {
            type: String,
            required: true,
        },other: {
            type: String,
            required: true,
        },city:{
            type: String,
            required: true,
        },province:{
            type: String,
            required: true,
        },pin:{
            type: Number,
            required: true,
        }
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
            title: String,
            brand: String,
        },
    ],
    paymentInfo: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        default: "Processing",
        enum: ["Not Processed", "Cash On Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },totalprice:{
        type: Number,
        required: true,
    },totalpriceAfterDiscount:{
        type: Number,
        required: true,
    }
},{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);