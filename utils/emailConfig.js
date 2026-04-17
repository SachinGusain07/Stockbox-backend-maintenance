// utils/emailConfig.js
export const getTransporterConfig = (type) => {
  const isAdvance = type === "advance";
  return {
    host: "smtp.gmail.com",
    port: isAdvance ? 465 : 587,
    secure: isAdvance ? true : false,
    auth: {
      user: isAdvance ? process.env.EMAIL_USER_ADVANCE_TRAINING : process.env.EMAIL_USER_SUPPORT,
      pass: isAdvance ? process.env.EMAIL_PASS_ADVANCE_TRAINING : process.env.EMAIL_PASS_SUPPORT,
    },
  };
};