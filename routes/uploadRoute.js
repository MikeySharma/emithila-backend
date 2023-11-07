const express = require('express');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware')
const { 
    uploadImages,
    deleteImages,
    uploadBlogImages,

} = require('../controller/uploadCtrl');
// const { blogImgResize, productImgResize, uploadPhoto } = require('../middleware/uploadImages');


router.put('/', authMiddleware, isAdmin, uploadImages );
router.delete('/delete-img/:id',authMiddleware, isAdmin, deleteImages);
router.put('/blog', authMiddleware, isAdmin, uploadBlogImages);


module.exports = router;