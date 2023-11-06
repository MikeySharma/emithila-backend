const Coupon = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async(req, res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);

    }catch(error){
        throw new Error(error);

    }
})
//Get  all Coupon

const getAllCoupon = asyncHandler(async(req, res)=>{
    try{
        const newCoupon = await Coupon.find();
        res.json(newCoupon);

    }catch(error){
        throw new Error(error);
    }
    
})
//Get  Coupon

const getACoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const newCoupon = await Coupon.findById(id);
        res.json(newCoupon);

    }catch(error){
        throw new Error(error);
    }
    
})

const updateCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const newCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(newCoupon);

    }catch(error){
        throw new Error(error);

    }
})
//Delete Coupon
const deleteCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const newCoupon = await Coupon.findByIdAndDelete(id);
        res.json(newCoupon);

    }catch(error){
        throw new Error(error);

    }
})
module.exports ={
    createCoupon,
    updateCoupon,
    getAllCoupon,
    deleteCoupon,
    getACoupon,
}