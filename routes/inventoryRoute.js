const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation");
const managementRoute = require("./managementRoute");

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView));
//management
router.use("/management", managementRoute);
router.post(
    "/update",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;