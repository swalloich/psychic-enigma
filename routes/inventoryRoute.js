const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;