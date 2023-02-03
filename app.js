// const secret = require("crypto").randomBytes(64).toString("hex");

// console.log(secret);

const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

function checkAuth(req, res, next) {
  const header = req.headers["authorization"];

  const token = header && header.split(" ")[1]; // AC token

  console.log("token");
  console.log(token);
  if (token == null) return res.status(401).send("not authorized");

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }
    req.user = user;

    next();
  });
}

app.get("/user/birthday", checkAuth, (req, res) => {
  const data = req.user;
  res.json({ status: 1, data });
});

app.post("/user/newuser", (req, res) => {
  const actoken = generateAccessToken(req.body.username);
  res.json(actoken);
});

function generateAccessToken(username) {
  const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

app.listen(process.env.PORT);
