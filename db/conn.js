const mongoose = require("mongoose");

// const DB = "mongodb://localhost:27017/ZairaOrganicSkincareDB";

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose is connected");
  })
  .catch((err) => console.log("not connected", err));

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

console.log("DB: ->" + process.env.DB);
