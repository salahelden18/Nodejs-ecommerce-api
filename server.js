const dotenv = require("dotenv");
const dbConnection = require("./config/database");

dotenv.config({ path: "config.env" });

// express app
const app = require("./app");

// database connection
dbConnection();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
