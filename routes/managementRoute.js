const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const classValidate = require("../utilities/classification-validation")

router.get("/", utilities.handleErrors(invController.buildInvManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.post(
    "/add-classification",
    classValidate.registrationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;