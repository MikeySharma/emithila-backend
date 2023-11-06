const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: [],
    color: [],
    tags: String,
    ratings: [{
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    totalrating: {
        type: Number,
        default: 0,
    }

},
    {
        timestamps: true
    });

//Export the model
module.exports = mongoose.model('Product', productSchema);