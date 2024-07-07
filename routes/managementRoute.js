const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");

router.get("/", utilities.handleErrors(invController.buildInvManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryItem));

router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification),
);
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventoryItem),
);

module.exports = router;