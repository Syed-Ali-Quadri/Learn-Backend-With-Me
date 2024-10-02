import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(300)
    .json(
      new ApiResponse(200, req.user, "Successfully fetched user information.")
    );
});

export { currentUser };
