export default {
  port: 3000,
  dbUri: process.env.MONGODB_URI,
  logLevel: "info",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",
  smtp: {
    user: "xtvxdb2itsmuxben@ethereal.email",
    pass: "sBaqt932k9F8p3NyUj",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
