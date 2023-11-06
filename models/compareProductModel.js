const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const compareSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId, ref : 'Product',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }

},{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Compare', compareSchema);