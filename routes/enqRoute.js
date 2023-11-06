const express = require("express");
const router = express.Router();
const { 
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getaEnquiry,
    getAllEnquiry,

} = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.get('/',authMiddleware, isAdmin, getAllEnquiry);
router.post('/', authMiddleware,  createEnquiry);
router.put('/:id', authMiddleware,  updateEnquiry);
router.delete('/:id', authMiddleware, deleteEnquiry);
router.get('/:id',authMiddleware, isAdmin, getaEnquiry);

module.exports = router;