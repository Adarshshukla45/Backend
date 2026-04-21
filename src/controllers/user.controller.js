import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  // git user details from frontend
  // validation - non empty
  // check if user already exists : username ,email
  // check fro images,check avatar
  // upload them to cludinary,avatar
  // cerate user object->create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body || {};
  console.log("email", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError("All fields are required", 400);
  }
  const existUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existUser) {
    throw new ApiError("User already exists", 400);
  }
  const avatarLoacalreq = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLoacalreq) {
    throw new ApiError("Avatar is required", 400);
  }

  const avatar = await uploadoncloudinary(avatarLoacalreq);
  const coverImage = await uploadoncloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError("Avatar is required", 400);
  }
  // cerate user object->create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );
  if (!createdUser) {
    throw new ApiError("User creation failed", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
  try {
    const user = await User.findById(userId);
    // generate access token and refresh token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //SEND TO DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Token generation failed", 500);
  }
});
const loginUser = asyncHandler(async (req, res) => {
  // req body->data
  // username or email
  // find the user
  // find the user
  // password check
  // access and refersh token generate
  // send cookie

  const { email, username, password } = req.body || {};
  if (!password || (!username && !email)) {
    throw new ApiError("Email or username and password are required", 400);
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const isPasswordValid = await user.isPasswordMatch(password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid user credentials", 401);
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loogedInUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  const options = {
    // only server can access this cookie
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, user: loogedInUser },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const options = {
    // only server can access this cookie
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  //cookies ka matlab hai ki client side pe store hone wala token, aur body ka matlab hai ki agar client side pe token nahi hai to frontend se bheja gaya token
  if (incomingRefreshToken) {
    throw new ApiError("Refresh token is required", 400);
  }

 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   );
 
   const user = await User.findById(decodedToken?._id);
 
   if (!user) {
     throw new ApiError("User not found", 404);
   }
 
   if (user?.refreshToken !== incomingRefreshToken) {
     throw new ApiError("Invalid refresh token expeired", 401);
   }
 
 
   const options={
     httpOnly:true,
     secure:true,
   }
   const { accessToken, newrefreshToken } = await generateAccessTokenAndRefreshToken(user._id);
   return res
     .status(200)
     .cookie("refreshToken", newrefreshToken, options)
     .cookie("accessToken", accessToken, options)
     .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));  
 
 } catch (error) {
    throw new ApiError("Invalid refresh token", 401);
 }



});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  generateAccessTokenAndRefreshToken,
};
// is puri file ka matalb hai ki humne user registration ke liye ek controller banaya hai jisme hum user ke details ko validate kar rahe hai,
// check kar rahe hai ki user already exist karta hai ya nahi, agar user exist nahi karta hai to hum uske avatar aur cover image ko cloudinary pe upload kar rahe hai,
// uske baad user ko database me create kar rahe hai aur finally user ke details ko response me bhej rahe hai.
