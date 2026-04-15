import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', // Replace with your Cloudinary cloud name
  api_key: 'process.env.CLOUDINARY_API_KEY', // Replace with your Cloudinary API key
  api_secret: 'process.env.CLOUDINARY_API_SECRET', // Click 'View API Keys' above to copy your API secret
});

const uploadoncloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            return null;
        }
        // uploading ifile to cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file uploaded successfully
        console.log("file is upload successfully on cloudinary",response.url);
       return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath); //remove the locally file temporary after upload as failed
        console.log(error);
        return null;
    }
}
export  {uploadoncloudinary};


    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
  