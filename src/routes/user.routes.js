import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";
import {loginUser} from "../controllers/user.controller.js";
import {logoutUser} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.js";
import {refreshAccessToken} from "../controllers/user.controller.js";
const router=Router();

router.route("/register").post(
    upload.fields([
        {name:"avatar",maxCount:1},
        {name:"coverImage",maxCount:1}
    ]),
    registerUser

);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router;


// all http routes
// get=> get data from server
// post=> send data to server
// put=> update data in server but whole data
// delete=> delete data from server
// patch=> update data in server but only specific fields
// options=> get all the http methods that server supports
// trace=> get all the http methods that server supports
