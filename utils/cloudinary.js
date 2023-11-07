const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key  : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

// const cloudinaryImgUploading = (filleToUploads)=>{
//     return new Promise((resolve)=>{
//         cloudinary.uploader.upload(filleToUploads, (result) =>{
//             resolve({
//                 url: result.secure_url,
//                 asset_id: result.asset_id,
//                 public_id: result.public_id,
//             },{
//                 resource_type: "auto",
//             })
//         })
//     })
// }
const cloudinaryImgUploading = (req) => {

    return new Promise((resolve, reject) => {
 
      let cld_upload_stream = cloudinary.uploader.upload_stream(
       {
        resource_type: 'image'
       },
       (error, result) => {
 
         if (result) {
           resolve({url: result.secure_url});
         } else {
           reject(error);
          }
        }
      ).end(req);
 
      streamifier.createReadStream(req).pipe(cld_upload_stream);
    });
 
 };
 
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
