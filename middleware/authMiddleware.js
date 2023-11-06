const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req?.headers?.authorization?.split(' ')[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                req.user = user;
                next();
            }

        }catch(error){
            throw new Error('Not Authorized or Token Expired. Please login again');
        }
    }else{
        throw new Error('Token Not Found');
    }
})

const isAdmin = asyncHandler(async(req, res, next)=>{
    const {email} = req.user;
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== 'admin'){
        throw new Error('You are not an admin');
    }else{
        next();
    }
})

module.exports = {authMiddleware, isAdmin} ;