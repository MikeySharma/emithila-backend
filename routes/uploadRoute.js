const express = require('express');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware')
const { 
    uploadImages,
    deleteImages,
    uploadBlogImages,

} = require('../controller/uploadCtrl');
// const {  uploadPhoto } = require('../middleware/uploadImages');


router.post('/', authMiddleware, isAdmin, uploadImages );
router.delete('/delete-img/:id',authMiddleware, isAdmin, deleteImages);
router.put('/blog', authMiddleware, isAdmin, uploadBlogImages);


module.exports = router;