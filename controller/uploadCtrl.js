const {cloudinaryImgUploading, cloudinaryDeleteImg} = require('../utils/cloudinary');
const asyncHandler = require('express-async-handler');

//upload product Images
const uploadImages = asyncHandler (async (req, res)=>{
    try{
        const urls = [];
        const files = req.files;
        console.log(files,'files');
        for(const file of files){
            const {buffer} = file;
            const newPath = await cloudinaryImgUploading(buffer);
            console.log(newPath, "new Path");
            console.log(Array.from(newPath));
            urls.push(Array.from(newPath));

        }
        const images = urls.map((file) => {
            return file;
        })
        res.json(urls);
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

        const urls = [];
        const files = Array.from(req.files);
        for(const file of files){
            const {buffer} = file;
            const newPath = await cloudinaryImgUploading(buffer);
            urls.push(newPath);
            
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