const express = require('express');
const router = express.Router();
const { createUser,
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

} = require('../controller/userController')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.delete('/empty-cart',authMiddleware, emptyCart);
router.post('/cart',authMiddleware, userCart);
router.put('/cart/remove',authMiddleware, removeProdFromCart);
router.post('/apply-coupon',authMiddleware, applyCoupon);
router.post("/create-order", authMiddleware, createOrder)
router.get('/get-order/:id', authMiddleware, getOrders);
router.get('/get-orders', authMiddleware, isAdmin, getAllOrders);


router.get('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);
router.get('/get-users', getAllUsers);

router.get('/get-cart',authMiddleware, getUserCart);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/compare', authMiddleware, getCompareProducts);
router.get('/:id', authMiddleware, isAdmin, getAUser);

router.delete('/:id', deleteUser);

router.put('/edit-user', authMiddleware, updateaUser);
router.put('/password',authMiddleware, updatePassword);
router.put('/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
router.put('/address', authMiddleware, saveAddress);
router.put('/reset-password/:token', resetPassword);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);


module.exports = router;