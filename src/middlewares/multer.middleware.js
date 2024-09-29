import multer from "multer"

const storage = multer.diskStorage({    // storage objects in disk storage.
    destination: function (req, file, cb) {
      cb(null, "./public/temp") // Alloting temp file path.
    },
    filename: function (req, file, cb) {
        // Using uniqueSuffix variable makes sure that the filename is unique.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix) // Filename unique suffix for temporary files.
    }
  })
  
  export default upload = multer({ storage: storage })