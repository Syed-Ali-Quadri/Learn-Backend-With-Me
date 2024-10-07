import { asyncHandler } from "../../utils/asyncHandler.js"; // Importing async handler to catch errors in async functions
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database
import { ApiResponse } from "../../utils/ApiResponse.js"; // Custom response handling class

// Controller to get a user channel's profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params; // Extracting the "username" from the request URL

  // If the username is missing or empty, throw a 400 error (bad request)
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing.");
  }

  // Aggregation pipeline to find the user and additional data
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(), // Match the username (case-insensitive)
      },
    },
    {
      $lookup: {
        from: "subscriptions", // Join with the "subscriptions" collection
        localField: "_id", // Matching the user's _id with the "channel" field in "subscriptions"
        foreignField: "channel",
        as: "subscribers", // Alias for the result of the join
      },
    },
    {
      $lookup: {
        from: "subscriptions", // Join with the "subscriptions" collection
        localField: "_id", // Matching the user's _id with the "subscribers" field in "subscriptions"
        foreignField: "subscribers",
        as: "subscribedTo", // Alias for the result of the join
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" }, // Count subscribers
        channelsSubscribedToCount: { $size: "$subscribedTo" }, // Count channels the user is subscribed to
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribes.subscribe"] }, // Check if the current user is subscribed
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1, // Include fullName in the result
        username: 1, // Include username
        subscribersCount: 1, // Include subscribers count
        channelsSubscribedToCount: 1, // Include channels subscribed count
        isSubscribed: 1, // Include whether the current user is subscribed
        avatar: 1, // Include avatar
        coverImage: 1, // Include cover image
        email: 1, // Include email
      },
    },
  ]);

  // If no channel is found, throw a 404 error (not found)
  if (!channel.length) {
    throw new ApiError(404, "channel does not exist.");
  }

  // Log the channel details for debugging (optional)
  console.log(channel);

  // Return a successful response with the channel data
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User channel fetched successfully."));
});

// Export the controller
export { getUserChannelProfile };
