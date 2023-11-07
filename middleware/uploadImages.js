const multer = require('multer');
const sharp = require("sharp");
const path = require("path");
const fs = require('fs');


const multerFilter =  (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else {
        cb({
            message: "Unsupported file format",
        }, false)
    }
}
const productImgResize = async (req, res, next)=>{
    if(!req.files) return next();
    await Promise.all( req.files.map(async (file)=>{
            await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })
    );
    next();
}
const blogImgResize = async (req, res, next)=>{
    if(!req.files) return next();
    await Promise.all( req.files.map(async (file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
        })
    );
    next();
}
const uploadPhoto = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFilter,
    limits: {fieldSize: 1000000},
});

module.exports = {uploadPhoto, productImgResize, blogImgResize};