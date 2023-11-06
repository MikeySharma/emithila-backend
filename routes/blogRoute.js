const express = require("express");
const router = express.Router();
const { createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,

} = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


router.post('/create-blog', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.put('/update-blog/:id', authMiddleware, isAdmin, updateBlog);
router.delete('/delete-blog/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/get-blog/:id', getBlog);
router.get('/get-all-blogs', getAllBlogs);

module.exports = router