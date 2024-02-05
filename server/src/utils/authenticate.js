// utils/authenticate.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin"); // Assuming there's a separate Admin model

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Access token is missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming decoded token includes role information
    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (!admin) return res.status(404).send({ message: "Admin not found" });
      req.user = { id: admin.id, role: "admin" };
    } else {
      // Default to user if not admin
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).send({ message: "User not found" });
      req.user = { id: user.id, role: "user" };
    }

    next();
  } catch (error) {
    res.status(403).send({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
