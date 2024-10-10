// Import necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility function to handle asynchronous code and automatically catch any errors.
import { ApiError } from "../../utils/ApiError.js"; // Custom error class for handling and throwing API errors.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Class to structure the API responses in a standardized way.
import { Tweet } from "../../models/tweet.model.js"; // The Tweet model representing the tweets collection in MongoDB.

// Controller function to get all tweets
const getTweets = asyncHandler(async (req, res) => {

    // Aggregation pipeline to retrieve tweets along with their owner's details
    const tweets = await Tweet.aggregate([
        {
            // $lookup stage to join the "tweets" collection with the "users" collection
            $lookup: {
                from: "users", // The users collection to join with the tweets collection
                foreignField: "_id", // The field in the users collection to match (the user's unique ID)
                localField: "owner", // The field in the tweets collection that references the tweet owner (the user's ID)
                as: "owner" // Output field name where the owner data will be stored
            }
        },
        {
            // $project stage to include only specific fields in the result
            $project: {
                content: 1, // Include the content of the tweet
                createdAt: 1, // Include the date when the tweet was created
                "owner.fullName": 1, // Include the full name of the tweet owner from the users collection
                "owner.username": 1, // Include the username of the tweet owner
                "owner.avatar": 1, // Include the avatar of the tweet owner
            }
        },
        {
            // $sort stage to sort the results by the tweet's creation date in descending order (newest tweets first)
            $sort: {
                createdAt: -1 // Sort by createdAt in descending order (-1)
            }
        }
    ]);

    // If no tweets are found, throw a 404 error
    if (!tweets.length) {
        throw new ApiError(404, "No tweets found.");
    }

    // Log the fetched tweets for debugging purposes
    console.log("Tweets fetched: ", tweets);

    // Return the fetched tweets with a success message using the standardized API response format
    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Successfully retrieved all tweets"));
});

// Export the getTweets function to be used in routes or other parts of the application
export { getTweets };
