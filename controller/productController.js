const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User = require("../models/userModels");
const Compare = require('../models/compareProductModel');
const validateMongodbId = require("../utils/validateMongodbId");

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);

        res.json({
            newProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

//Update Product

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updateProduct);


    } catch (error) {
        throw new Error(error)
    }
})


//Delete a Product

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);

    } catch (error) {
        throw new Error(error)
    }
})

//Get a Product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const findProduct = await Product.findById(id).populate('ratings.postedBy').exec();
        res.json(findProduct)

    } catch (error) {
        throw new Error(error);
    }
})


//Get all Product through filtering and Sorting
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        //Filtering
        const queryObject = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fileds"];
        excludeFields.forEach((elem) => delete queryObject[elem])
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        } else {
            query = query.sort('-createdAt');
        }
        //Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);

        } else {
            query = query.select("-__v");
        }
        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error('This page does not exist');
            }
        }


        const product = await query;
        res.json(product)

    } catch (error) {
        throw new Error(error)
    }
})

//Total Rating 
const rating = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    const {star, productId, comment} = req.body;
    const product = await Product.findById(productId);
    try{
        const alreadyRated = product.ratings.find((userId)=> userId.postedBy.toString() === _id.toString())
        if(alreadyRated){
           await Product.updateOne({
                ratings: {$elemMatch: alreadyRated},
            },{
               $set:{"ratings.$.star": star, "ratings.$.comment": comment} 
            },{
                new: true,
            })
        }else{
            await Product.findByIdAndUpdate(productId, {
                $push:{
                    ratings:{
                    star: star,
                    comment: comment,
                    postedBy: _id,
                    }
                }
            },{
                new: true,
            })
        }
        const getAllRatings = await Product.findById(productId);
        const totalRatings = getAllRatings.ratings.length;
        const totalStar = getAllRatings.ratings.map((item)=>item.star).reduce((prev,curr)=> prev + curr, 0)
        const actualRating = Math.round(totalStar/totalRatings);
        const finalProduct = await Product.findByIdAndUpdate(productId,{
            totalrating: actualRating,
        }, {
            new: true,
        })
        res.json(finalProduct)
    }catch(error){
        throw new Error(error);
    }
})

//Add to WishList 

const addToWishlist = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {productId} = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id)=> id.toString() === productId.toString());
        if(alreadyAdded){

            const user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: productId},
            },{
                new: true
            })
            res.json(user);

        }else{
            const user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: productId},
            },{
                new: true
            })
            res.json(user);

        }


    }catch(error){
        throw new Error(error);
    }
})

const addToComapare = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {productId} = req.body;
    try{
           const newCompare = await new Compare({
            productId: productId,
            userId: _id,
           }).save();
           res.json(newCompare);
    }catch(error){
        throw new Error(error);
    }
})

const removeFromCompare = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {id} = req.params;
    validateMongodbId(_id);
    try{
        const newCompare = await Compare.findOneAndRemove({userId: _id, _id: id})
        res.json(newCompare);
    }catch(error){
        throw new Error(error);
    }
})


module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    rating,
    addToWishlist,
    addToComapare,
    removeFromCompare,
}