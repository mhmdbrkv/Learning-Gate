const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_CONNECT).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  });
};
module.exports = dbConnection;
