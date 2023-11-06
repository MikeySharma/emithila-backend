const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key  : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

const cloudinaryImgUploading = (filleToUploads)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(filleToUploads, (result) =>{
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            },{
                resource_type: "auto",
            })
        })
    })
}

const cloudinaryDeleteImg = (fileToDelete)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.destroy(fileToDelete, (result) =>{
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            },{
                resource_type: "auto",
            })
        })
    })
}
  
        
module.exports = {cloudinaryImgUploading, cloudinaryDeleteImg}
