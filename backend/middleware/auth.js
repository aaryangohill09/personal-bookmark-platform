const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const actualToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    req.user = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = auth;
