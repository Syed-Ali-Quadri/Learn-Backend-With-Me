// Import necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure.
import { Tweet } from "../../models/tweet.model.js"; // The Tweet model to interact with tweets collection in MongoDB.
import mongoose from "mongoose"; // For ObjectId conversion and MongoDB queries.

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
    // 1. Get the tweet ID from the request parameters.
    const tweetId = req.params.tweetId;

    // 2. Check if the tweet exists in the database.
    if (!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(404, "Tweet not found."); // If tweet not found, throw an error.

    // 3. Find and delete the tweet by its ID using the Tweet model.
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    // 4. Return a success response with the deleted tweet data.
    res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", deletedTweet));
})

export { deleteTweet }