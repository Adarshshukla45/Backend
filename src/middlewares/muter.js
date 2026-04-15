// multer is a middleware for handling multipart/form-data, 
// which is primarily used for uploading files. 
// It is written on top of busboy for maximum efficiency.




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

const upload = multer({ storage, })

export  {upload};