const express = require("express");
const router = express.Router();
const { 
    createCategory,
    updateCategory,
    deleteCategory,
    getaCategory,
    getAllCategory,

} = require("../controller/productCategoryController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/', getAllCategory);
router.get('/:id', getaCategory);

module.exports = router;