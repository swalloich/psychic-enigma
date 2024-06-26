const express = require("express");
const router = new express.Router();
const { buildLogin } = require("../utilities/index");
const accountController = require("../controllers/accountController");

router.get("/login", buildLogin);

module.exports = router;