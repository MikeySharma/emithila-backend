const User = require('../models/userModels');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Compare = require('../models/compareProductModel');
const Coupon = require('../models/couponModel');
const Order = require("../models/orderModel");
const asyncHandler = require('express-async-handler');
const uniqid = require("uniqid");
const { generateToken } = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const { sendEmail } = require('./emailController')
const jwt = require('jsonwebtoken');

const createUser = asyncHandler(async (req, res) => {

    const email = req.body.email;
    const findUser = await User.findOne({ emial: email });
    if (!findUser) {
        //Create a New User
        const newUser = await User.create(req.body);
        res.json(newUser);

    } else {
        res.json({
            message: "User Already Exists",
            success: false
        })
    }

})
//Admin Login Controller
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Error("Unauthorized");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findAdmin._id);
        await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken,
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })

    } else {
        throw new Error('Invalid Credentials');
    }

})
//user Login Controller
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findUser._id);
        await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken,
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })

    } else {
        throw new Error('Invalid Credentials');
    }

})

//handle REfresh Token here
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) { throw new Error('No Token Found In Cookie') }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('Token Not Found');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with token')
        };
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    })

})

//Handle Logout Functionality
const handleLogout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) { throw new Error('No Token Found In Cookie') }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        })
        return res.sendStatus(204) //forbidden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: '',
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    })
    res.sendStatus(204); //forbidden
})

// Update a User
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true,
        });
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error);
    }

})
// Save Address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            Address: req?.body?.address,
        }, {
            new: true,
        });
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error);
    }

})

//Get all Users

const getAllUsers = asyncHandler(async (req, res) => {
    const getUsers = await User.find();
    try {
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
})
// Get A Single user
const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({ getaUser });
    } catch (error) {
        throw new Error(error);
    }
})

//Delete a User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({ deleteUser })
    } catch (error) {
        throw new Error(error)
    }
})

//Block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const toBeBlock = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true,
        })
        res.json({
            message: 'User Blocked'
        })

    } catch (error) {
        throw new Error(error);
    }
})
//UnBlock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const toBeUnblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        })
        res.json({
            message: 'User Unblocked'
        })

    } catch (error) {
        throw new Error(error);
    }
})

//Update Password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    } else {
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found with this emial');
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your Password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}>ClickHere</a>`
        const data = {
            to: email,
            subject: "Forgot Password Link",
            text: "Hey User",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
})
//Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    let { token } = req.params;
    let user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    })
    if (!user) throw new Error('Token Expired. Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})
// Get  Wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);

    } catch (error) {
        throw new Error(error);
    }
})
//Add to User Cart
const userCart = asyncHandler(async (req, res) => {
    const { userId, productId, color, quantity, price} = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            quantity,
            price,
        }).save();
        res.json(newCart);

    } catch (error) {
        throw new Error(error);
    }
})
//get User Cart

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.find({ userId: _id }).populate('productId');
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }
})

const removeProdFromCart = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {cartProductId} = req.body;
    validateMongodbId(_id);
    try{
        const cart = await Cart.deleteOne({userId: _id, _id : cartProductId})
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
})

//Create Order
const createOrder = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {shippingInfo, orderItems, totalprice,  totalpriceAfterDiscount, paymentInfo} = req.body;
    validateMongodbId(_id);
    try{
        const order = await Order.create({
            shippingInfo, orderItems, totalprice,  totalpriceAfterDiscount, paymentInfo, userId: _id,
        })
        res.json({
            order,
            success: true,
        })
    }catch(error){
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.deleteMany({ userId: user._id });
        await User.findByIdAndUpdate(user?._id, {
            cart: []
        }, {
            new: true,
        })
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }
})

//aPply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({ orderBy: user?._id }).populate('products.product');
    let totalAfterDiscount = cartTotal - ((cartTotal * validCoupon.discount) / 100).toFixed(2);
    const newCartForUser = await Cart.findOneAndUpdate({ orderBy: user?._id },
        { totalAfterDiscount },
        { new: true }
    )
    await User.findOneAndUpdate(req.user, { cart: newCartForUser }, { new: true });
    res.json(newCartForUser);
})
//Create Order
// const createOrder = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     validateMongodbId(_id);
//     const { COD, couponApplied } = req.body;
//     if (!COD) {
//         throw new Error('Create Cash order failer');
//     } try {
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({ orderBy: user._id })
//         let finalAmount = 0;
//         if (couponApplied && userCart.totalAfterDiscount) {
//             finalAmount = userCart.totalAfterDiscount;
//         } else {
//             finalAmount = userCart.cartTotal;
//         }
//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount: finalAmount,
//                 status: "Cash On Delivery",
//                 created: Date.now(),
//                 currency: "NPR",
//             },
//             orderBy: user._id,
//             orderStatus: "Cash On Delivery",
//         }).save();

//         let update = userCart.products.map((item) => {
//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } }
//                 }
//             }
//         });
//         const updated = await Product.bulkWrite(update, {});
//         res.json({ message: "success" })
//     } catch (error) {
//         throw new Error(error);
//     }
// })
// get Orders
const getOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const userOrders = await Order.findOne({ _id : id });
        res.json(userOrders);

    } catch (error) {
        throw new Error(error);
    }
})

//get all orders
const getAllOrders = asyncHandler(async(req,res)=>{
    try{
        const allUserOrders = await Order.find().populate('userId').exec();
        res.json(allUserOrders);
    }catch(error){
        throw new Error(error);
    }
})

//Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status,
            }
        }, {
            new: true,
        })
        res.json(updatedOrder);
    } catch (error) {
        throw new Error(error);
    }
})

const getCompareProducts = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const compareProduct = await Compare.find({userId : _id}).populate('productId').exec();
        res.json(compareProduct);

    }catch(error){
        throw new Error(error);
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUsers,
    getAUser,
    deleteUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    handleLogout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllOrders,
    removeProdFromCart,
    getCompareProducts,
};