// Import necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure.
import { Tweet } from "../../models/tweet.model.js"; // The Tweet model to interact with tweets collection in MongoDB.

// Function to edit a tweet
const updateTweet = asyncHandler(async (req, res) => {
    // Step 1: Extract the edited content from the request body and tweetId from request parameters
    const { editedContent } = req.body;
    const tweetId = req.params.tweetId;

    // Step 2: Validate that the edited content is provided
    if (!editedContent) {
        return new ApiError(401, "Provide edited content."); // If no edited content, throw an error.
    }

    // Step 3: Find the tweet by its ID
    const editedTweet = await Tweet.findById(tweetId);

    // Step 4: If tweet found, update the content with the new edited content
    editedTweet.content = editedContent;

    // Step 5: Save the updated tweet back to the database
    await editedTweet.save();

    // Step 6: Log the edited tweet for debugging purposes
    console.log(editedTweet);

    // Step 7: If tweet was not edited (tweet not found), return an error response
    if (!editedTweet) {
        throw new ApiError(401, "Failed to edit tweet."); // Error if the tweet couldn't be found/edited.
    }

    // Step 8: If the tweet is successfully edited, send a success response with the edited tweet data
    return res
        .status(200)
        .json(new ApiResponse(200, "Tweet edited successfully.", editedTweet));
});

// Export the updateTweet function for use in routes
export { updateTweet };
