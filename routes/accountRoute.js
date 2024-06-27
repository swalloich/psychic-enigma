const express = require("express");
const router = new express.Router();
const { Util } = require("../utilities/index");
const accountController = require("../controllers/accountController");

router.get("/login", Util.handleErrors(accountController.buildLogin));

module.exports = router;