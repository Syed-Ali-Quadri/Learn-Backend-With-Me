import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) =>{
    res.status(200).json({
        message: "User registered successfully"
    })
})

export { registerUser }


// If I want to write code without "asyncHandler" then in every file I have to write try....catch again and again....

/* const registerUser = async (req, res, next) => {
    try {
      // Your async logic
      res.status(200).json({
        message: "User registered successfully",
      });
    } catch (err) {
      next(err); // Manually pass the error to the next middleware
    }
  };
  
  export { registerUser }; */