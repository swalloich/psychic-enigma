const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const Validate = {}
const inventoryModel = require("../models/inventory-model");

Validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide a make")
            .escape(),
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Please provide a model")
            .escape(),
        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Please provide a year")
            .isInt({min: 1000})
            .withMessage("Year must be a number")
            .escape(),
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Invalid description")
            .escape(),
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Invalid description")
            .escape(),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image URL.")
            .isURL({ require_protocol: false, require_host: false })
            .withMessage("Invalid image URL format."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail image URL.")
            .isURL({ require_protocol: false, require_host: false })
            .withMessage("Invalid thumbnail URL format."),
        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Please provide a price")
            .isNumeric()
            .withMessage("Year must be a number")
            .escape(),
        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Please provide a mileage value")
            .isNumeric()
            .withMessage("Value must be a number")
            .escape(),
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Please provide a color")
            .escape(),
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Please choose a classification")
            .escape(),
    ]
}

Validate.checkInvData = async (req, res, next) => {
    console.log("Checking Inventory Data")
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let errors = [];
    errors = validationResult(req);

    const data = await inventoryModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(data);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Inventory Management Dashboard",
            classificationList: classificationList,
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
        return;
    }
    next();
}

Validate.checkUpdateData = async (req, res, next) => {
    console.log("Checking Inventory Data")
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let errors = [];
    errors = validationResult(req);

    const data = await inventoryModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(data);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            classificationList: classificationList,
            nav,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
        return;
    }
    next();
}

module.exports = Validate;