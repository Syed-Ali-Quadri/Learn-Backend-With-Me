class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}


// Here is the example and output (If the response went success, and statusCode is below 400).

/* const response = new ApiResponse(200, { username: "JohnDoe" }, "User registered successfully");

// response will look like:
{
  statusCode: 200,
  data: { username: "JohnDoe" },
  message: "User registered successfully",
  success: true // because statusCode is less than 400
} */



// Here is the example and output (If the response went unsuccess, and statusCode is above or equal 400).

/* const response = new ApiResponse(400, null, "Username already exists");

// response will look like:
{
  statusCode: 400,
  data: null, // no useful data because the request failed
  message: "Username already exists",
  success: false // because statusCode is 400 or higher
} */


