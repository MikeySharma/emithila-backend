const {cloudinaryImgUploading, cloudinaryDeleteImg} = require('../utils/cloudinary');
const asyncHandler = require('express-async-handler');
const fs = require('fs');

//upload product Images
const uploadImages = asyncHandler (async (req, res)=>{
    try{

        const uploader = (path)=> cloudinaryImgUploading(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);

        }
        const images = urls.map((file) => {
            return file;
        })
        res.json(images);
    }catch(error){
        throw new Error(error);
    }
})
//Delete product Images
const deleteImages = asyncHandler (async (req, res)=>{
    const {id} = req.params;
    try{

        const deleter =  cloudinaryDeleteImg(id, "images");
        res.json({id : id, message: "Deleted"})
       
    }catch(error){
        throw new Error(error);
    }
})

//upload blog Images
const uploadBlogImages = asyncHandler (async (req, res)=>{
   
    try{

        const uploader = (path)=> cloudinaryImgUploading(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
            
        }
        const images = urls.map((file) => {
            return file;
        })
        res.json(images);
    }catch(error){
        throw new Error(error);
    }
})

module.exports ={
    uploadImages,
    uploadBlogImages,
    deleteImages,

}