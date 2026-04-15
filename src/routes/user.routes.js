import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";

const router=Router();

router.route("/register").post(registerUser);


export default router;


// all http routes
// get=> get data from server
// post=> send data to server
// put=> update data in server but whole data
// delete=> delete data from server
// patch=> update data in server but only specific fields
// options=> get all the http methods that server supports
// trace=> get all the http methods that server supports
