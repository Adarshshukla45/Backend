const asnsyncHandler = (requestHandler) => {
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res)).catch((err)=>next(err))
    }
}





export {asyncHandler};


// const asyncHandler=()=>{}
// const asyncHandler=(func)=>()=>{}
// const asyncHandler=(func)=> async()=>{}
// const asyncHanler=(fn)=>(req,res,next)=>{
//     try{
//              await fn(req,res)
//     }
//     catch(err){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message || "Internal Server Error"
//         });
//     }
// }   