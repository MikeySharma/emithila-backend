const express = require('express');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware')
const { 
    uploadImages,
    deleteImages,
    uploadBlogImages,

} = require('../controller/uploadCtrl');
const { blogImgResize, productImgResize, uploadPhoto } = require('../middleware/uploadImages');


router.put('/', authMiddleware, isAdmin, uploadPhoto.array("images", 10), uploadImages );
router.delete('/delete-img/:id',authMiddleware, isAdmin, deleteImages);
router.put('/blog', authMiddleware, isAdmin, uploadPhoto.array("images", 2), uploadBlogImages);


module.exports = router;