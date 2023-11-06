const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


//Create a Product Category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})

//Update a Product Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newCategory = await BlogCategory.findByIdAndDelete(id);
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})
//Fetch a Category
const getaCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newCategory = await BlogCategory.findById(id)
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})
//Fetch all Category
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BlogCategory.find();
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getaCategory,
    getAllCategory,
};