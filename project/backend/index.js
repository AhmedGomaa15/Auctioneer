const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const courseRoutes = require("./routes/course");
const userTypeRoutes = require("./routes/userType");
const authRoutes = require("./routes/auth");

const verifyToken = require("./middlewares/token-verify");
const role = require("./middlewares/role");

const app = express();

const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("uploads"));

const db = require("./config/database");

app.use("/api/course", verifyToken, courseRoutes);
app.use("/api/role", verifyToken, role("Admin"), userTypeRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, host, () => {
  console.log("Server is running");
});
