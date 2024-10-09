import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility function for handling async functions in express routes
import { ApiResponse } from "../../utils/ApiResponse.js"; // Custom response handler class for generating standardized API responses
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the MongoDB collection
import mongoose from "mongoose"; // Importing mongoose for MongoDB object modeling

// Controller function to get the user's watched video history
const getUserWatchedHistory = asyncHandler(async (req, res) => {
    // Aggregation pipeline to fetch user's watched videos and their details
    const user = await User.aggregate([
        {
            // Step 1: Match the logged-in user by their ID
            $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
        }, 
        {
            // Step 2: Perform a lookup (join) with the "videos" collection to get watch history
            $lookup: {
                from: "videos", // Join with the "videos" collection
                localField: "watchHistory", // Use the "watchHistory" array in the User document
                foreignField: "_id", // Match it with the "_id" field in the "videos" collection
                as: "watchHistory", // The results will be stored in a new field called "watchHistory"
                pipeline: [ // Additional operations (pipeline) on the results from the "videos" collection
                    {
                        // Step 3: Perform another lookup to get details of the video owner (from "users" collection)
                        $lookup: {
                            from: "users", // Join with the "users" collection
                            localField: "owner", // Match the "owner" field in the video document
                            foreignField: "_id", // With the "_id" field in the "users" collection
                            as: "owner", // Store the result in a new field called "owner"
                            pipeline: [ // Further operations to filter down the owner's data
                                {
                                    // Step 4: Project only the fields you need from the video owner
                                    $project: {
                                        fullName: 1, // Get the owner's full name
                                        username: 1, // Get the owner's username
                                        avatar: 1 // Get the owner's avatar (profile picture)
                                    }
                                }
                            ]
                        }
                    },
                    {
                        // Step 5: Add the owner details to each video by taking the first item from the "owner" array
                        $addFields: {
                            owner: {
                                $first: "$owner" // Since lookup returns an array, take the first (and only) owner
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // Log the resulting user object (for debugging purposes)
    console.log(user[0]);

    // Step 6: Send the watch history back to the client in a structured response
    return res
    .status(200) // Set HTTP status code to 200 (OK)
    .json(new ApiResponse(200, user[0].watchHistory, "User's watched history successfully fetched.")); // Return the user's watch history
});

// Export the controller function for use in routes
export { getUserWatchedHistory };
