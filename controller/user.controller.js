// /controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/user.schema.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import errorResponse from "../middleware/errorResponse.js";
import { generateJWT, sendTokenInCookie } from "../utils/generateJwtToken.js";

// //Signup Route
// export const signup = asyncHandler(async (req, res, next) => {
//   const { name, email, password, confirmPassword } = req.body;

//   if (!name || !email || !password || !confirmPassword) {
//     return next(
//       new errorResponse(
//         "Please provide all fields (name, email, password, confirmPassword)",
//         400
//       )
//     );
//   }

//   if (password !== confirmPassword) {
//     return next(new errorResponse("Passwords do not match", 400));
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return next(new errorResponse("User already exists with this email", 400));
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const newUser = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   res.status(201).json({
//     status: "success",
//     message: "User created successfully",
//     data: {
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//       },
//     },
//   });
// });


export const updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required." });
    }

    // Find the user from database
    const user = await User.findById(req.user.id); // assuming you have user info in req.user

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Update fields
    if (email) user.email = email;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({ status: "success", message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};



export const Login = asyncHandler(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return next(new errorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new errorResponse("Invalid credentials", 401));
  }
  const token = generateJWT(user);
  sendTokenInCookie(res, token);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const Logout = asyncHandler(async (req, res, next) => {
  const logout = res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  if(!logout) {
    return res.status(400).json({ status: "fail", message: "Failed to clear cookie." });

  }


    return res.status(200).json({ status: "success", message: "Logged out successfully." });
 
});

