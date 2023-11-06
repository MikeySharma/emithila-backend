const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
    createHmac,
} = require('node:crypto');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: []
    },
    compare:{
        type: Array,
    default: [],
    },
    Address: {
        type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
}
);
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const hmac = createHmac('sha256', 'mikey23462');
    let resetToken = hmac.toString('hex');
    this.passwordResetToken = hmac.update(resetToken).digest('hex');
    resetToken = this.passwordResetToken
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
    console.log(this.passwordResetToken, this.passwordResetExpires)
    return resetToken;
};

//Export the model
module.exports = mongoose.model('User', userSchema);