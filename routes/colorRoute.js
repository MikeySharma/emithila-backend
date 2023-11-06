const express = require("express");
const router = express.Router();
const { 
    createCategory,
    updateCategory,
    deleteCategory,
    getaCategory,
    getAllCategory,

} = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/:id', getaCategory);
router.get('/', getAllCategory);

module.exports = router;