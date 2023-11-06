const express = require('express');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware')
const { createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    rating,
    addToWishlist,
    addToComapare,
    removeFromCompare,
} = require('../controller/productController');
const { productImgResize, uploadPhoto } = require('../middleware/uploadImages');


router.get('/', getAllProduct)
router.get('/:id', getaProduct)
router.put('/rating', authMiddleware, rating)
router.put('/wishlist', authMiddleware, addToWishlist)
router.post('/compare', authMiddleware, addToComapare);
router.post('/',authMiddleware, isAdmin, createProduct)
router.put('/:id',authMiddleware, isAdmin , updateProduct)
router.delete('/compare/:id', authMiddleware, removeFromCompare);
router.delete('/:id',authMiddleware, isAdmin, deleteProduct)

module.exports = router;