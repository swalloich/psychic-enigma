const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const Validate = {}

Validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must contain only letters an numbers."),
    ];
}

Validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            errors,
            title: "Inventory Management Dashboard",
            nav,
            classification_name,
        });
        return
    }
    next();
}

module.exports = Validate;