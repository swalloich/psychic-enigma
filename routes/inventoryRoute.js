const express = require("express")
const router = new express.Router()
const { Util } = require("../utilities/index")
const invController = require("../controllers/invController")

router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", Util.handleErrors(invController.buildByInvId));

module.exports = router;