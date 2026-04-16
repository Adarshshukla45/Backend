import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async(req,res)=>{
        // git user details from frontend
        // validation - non empty
        // check if user already exists : username ,email
        // check fro images,check avatar
        // upload them to cludinary,avatar
        // cerate user object->create entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return res
        
       const{fullname,email,username,password}=req.body
       console.log("email",email);

      if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError("All fields are required",400);
      }
      const existUser=await User.findOne({$or:[{email},{username}]})
      if(existUser){
        throw new ApiError("User already exists",400);
      }
      const avatarLoacalreq=req.files?.avatar[0]?.path;

      const coverImageLocalPath=req.files?.coverImage[0]?.path;
      if(!avatarLoacalreq){
        throw new ApiError("Avatar is required",400);
      }
       
      const avatar=await uploadoncloudinary(avatarLoacalreq);
      const coverImage=await uploadoncloudinary(coverImageLocalPath);

      if(!avatar){
        throw new ApiError("Avatar is required",400);
      }
      // cerate user object->create entry in db
      const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
      })
      
      const createdUser=await User.findById(user._id).select(
        "-password -refreshToken -__v"
      )
      if(!createdUser){
        throw new ApiError("User creation failed",500);
      }

      return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
      )






      

})

export {registerUser};
