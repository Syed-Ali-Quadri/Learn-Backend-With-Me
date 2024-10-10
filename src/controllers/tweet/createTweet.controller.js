// Import necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure.
import { Tweet } from "../../models/tweet.model.js"; // The Tweet model to interact with tweets collection in MongoDB.
import mongoose from "mongoose"; // For ObjectId conversion and MongoDB queries.

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  // Step 1: Extract 'content' from request body and 'userId' from the authenticated request
  const { content } = req.body;
  const userId = req.user;

  // Step 2: Check if the user is authenticated
  if (!userId) {
    throw new ApiError(404, "Unauthorized access."); // If no user found in the request, return an error.
  }

  // Step 3: Validate if content exists
  if (!content) {
    throw new ApiError(401, "Please provide content."); // If no content provided, throw an error.
  }

  // Step 4: Create a new tweet in the 'tweets' collection
  const newTweet = await Tweet.create({
    content, // Set tweet content from the request body.
    owner: userId._id, // Set tweet owner using the authenticated user ID.
  });

  // Step 5: Check if the tweet was successfully created
  if (!newTweet) {
    throw new ApiError(500, "Failed to create tweet."); // If tweet creation failed, throw an error.
  }

  // Step 6: Start aggregation pipeline to fetch tweet along with its owner's details
  const tweetAggregate = await Tweet.aggregate([
    {
      // Step 7: Match the newly created tweet's _id to find the tweet we just inserted
      $match: {
        _id: new mongoose.Types.ObjectId(newTweet._id), // Use ObjectId conversion to match the correct tweet.
      },
    },
    {
      // Step 8: Use $lookup to join the 'users' collection to get the owner's details
      $lookup: {
        from: "users", // The 'users' collection to lookup.
        localField: "owner", // The 'owner' field in the tweet (this is the user ID).
        foreignField: "_id", // The '_id' field in the 'users' collection to match.
        as: "ownerDetails", // Store the result as 'ownerDetails' (an array of user details).
      },
    },
    {
      // Step 9: Unwind the 'ownerDetails' array into a single object
      $unwind: "$ownerDetails", // Since $lookup returns an array, this ensures we have a single user object.
    },
    {
      // Step 10: Use $project to select only the fields we want to return in the response
      $project: {
        content: 1, // Include the tweet content.
        "ownerDetails.fullName": 1, // Include the owner's full name.
        "ownerDetails.username": 1, // Include the owner's username.
        "ownerDetails.avatar": 1, // Include the owner's avatar.
      },
    },
  ]);

  // Step 11: Check if the aggregation returned any result
  if (!tweetAggregate.length) {
    throw new ApiError(500, "Failed to retrieve tweet after creation."); // If no tweet found, return an error.
  }

  // Step 12: Log the tweet aggregate result for debugging
  console.log("Tweet Aggregate (username): ", tweetAggregate[0].ownerDetails.username);

  // Step 13: Log the new tweet for debugging
  console.log("New Tweet: ", newTweet);

  // Step 14: Return a success response with the aggregated tweet and user details
  return res.status(200).json(
    new ApiResponse(200, tweetAggregate[0], "Tweet created successfully.")
  );
});

// Export the 'createTweet' function for use in routes
export { createTweet };
