const express = require("express");
const validateToken = express.Router();

validateToken.post("/validateToken", async (req, res) => {
  console.log("ciao");
});

module.exports = validateToken;
