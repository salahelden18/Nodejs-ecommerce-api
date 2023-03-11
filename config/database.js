const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected");
    })
    .catch((e) => {
      console.log("Error in Connection", e);
      process.exit(1);
    });
};

module.exports = dbConnection;
