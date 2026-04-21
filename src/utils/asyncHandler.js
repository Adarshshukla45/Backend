
const asyncHandler = (requestHandler) => {
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res)).catch((err)=>next(err))
    }
}





export {asyncHandler};
// is file ka matlab hai ki humne ek asyncHandler function banaya hai jo ki ek higher-order function hai, 
// jo ki ek request handler function ko argument ke roop me leta hai aur ek naya function return karta hai jo ki req, res aur next parameters leta hai. 
// is function ke andar humne Promise.resolve() method ka use kiya hai jisse ki hum apne request handler function ko asynchronous bana sake aur agar koi error aata hai to usse catch karke next() function ke through error handling middleware tak bhej sake. 
// is tarah se hum apne controllers me asyncHandler function ka use karke apne asynchronous code ko handle kar sakte hai aur error handling ko bhi asaan bana sakte hai.














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