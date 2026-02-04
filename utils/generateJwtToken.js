import jwt from "jsonwebtoken";

export const generateJWT = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
  };

  const options = {
    expiresIn: "1h",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
};

export const sendTokenInCookie = (res, token) => {
  console.log("Sending token in cookie:", token);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
    sameSite: "None",
  });
};
