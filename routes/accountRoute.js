const express = require("express");
const router = new express.Router();
const { Util } = require("../utilities/index");
const accountController = require("../controllers/accountController");

// get routes
router.get("/login", Util.handleErrors(accountController.buildLogin));
router.get("/register", Util.handleErrors(accountController.buildRegistration));
//post routes
router.post("/register", Util.handleErrors(accountController.registerAccount));

module.exports = router;