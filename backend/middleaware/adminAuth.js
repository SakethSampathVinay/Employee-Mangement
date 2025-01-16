import jwt from "jsonwebtoken";

const authAdmin = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response
        .status(401)
        .json({
          success: false,
          message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    console.log("Token:", token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);

    // Verify token details and admin email
    if (!decodedToken || decodedToken.email !== process.env.ADMIN_EMAIL) {
      return response
        .status(403)
        .json({
          success: false,
          message: "Invalid token or unauthorized access.",
        });
    }

    // Attach decoded token to request
    request.admin = decodedToken;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return response
      .status(403)
      .json({
        success: false,
        message: "Unauthorized access. Invalid or expired token.",
      });
  }
};

export default authAdmin;
