export default {
  port: 1337,
  origin: "http://localhost:3000",
  dbUri: process.env.MONGODB_URI,
  logLevel: "info",
  accessTokenPrivateKey: `${process.env.ACCESS_TOKEN_PRIVATE_KEY}`,
  accessTokenPublicKey: `${process.env.ACCESS_TOKEN_PUBLIC_KEY}`,
  refreshTokenPrivateKey: `${process.env.REFRESH_TOKEN_PRIVATE_KEY}`,
  refreshTokenPublicKey: `${process.env.REFRESH_TOKEN_PUBLIC_KEY}`,
  smtp: {
    user: "edmund.okon@ethereal.email",
    pass: "CZ5XnV81FH3Hz11nNW",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
