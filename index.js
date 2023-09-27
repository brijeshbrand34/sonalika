var cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({
  path: "./config.env",
});
require("./db/conn");
const express = require("express");
const User = require("./model/UserSchema");

const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Middleware for parsing JSON data

app.use(express.json());

app.use(cors());

app.use('/images', express.static('backend/uploads'));

app.use(require("./router/auth"));
app.use(require("./router/Blog"));

app.use(require("./router/Banner"));
app.use(require("./router/blogBanner"));
app.use(require("./router/contacts"));
app.use(require("./router/product"));
app.use(require("./router/review"));
app.use(require("./router/cart"));
app.use(require("./router/order"));
app.use(require("./router/brands"));
app.use(require("./router/categories"));
app.use(require("./router/featureProducts"));
app.use(require("./router/coupons"));


app.use(require("./router/subCategories"));
app.use(require("./router/popUp"));
app.use(require("./router/topCollection"));



app.use(require("./router/admin"));
app.use(require("./router/websiteHeader"));

app.use(express.urlencoded({ extended: true }));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.get("/home", (req, res) => {
  res.send("this is home page");
});
app.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT}`);
});
