
export const getTransporterConfig = (type) => {
  const isAdvance = type === "advance";
  
  return {
    host: "smtp.gmail.com",
    port: isAdvance ? 465 : 587,
    secure: isAdvance, // true for 465, false for 587
    auth: {
      user: isAdvance ? process.env.EMAIL_USER_ADVANCE_TRAINING : process.env.EMAIL_USERNAME,
      pass: isAdvance ? process.env.EMAIL_PASS_ADVANCE_TRAINING : process.env.EMAIL_PASSWORD,
    },
    // We add this so the SendEmail utility knows who the admin is for this type
    adminEmail: isAdvance ? process.env.EMAIL_USER_ADVANCE_TRAINING : process.env.EMAIL_USERNAME,
  };
};