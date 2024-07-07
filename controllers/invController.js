const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)

        if (data.length == 0) {
            const error = new Error("No classifications with that ID were found.");
            error.status = 404;
            return next(error);
        }

        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    } catch (err) {
        next(err);
    }
}

invCont.buildByInvId = async function (req, res, next) {
    try {
        const inventory_id = req.params.inventoryId;
        const data = await invModel.getInventoryByInvId(inventory_id);

        if (data.length == 0) {
            const error = new Error("No vehicle with that ID was found.");
            error.status = 404;
            return next(error);
        }

        const bodyHtml = await utilities.buildInvItemDescription(data);
        let nav = await utilities.getNav();
        res.render("./inventory/item", {
            title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
            img: {
                url: data[0].inv_image,
                alt: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
            },
            description: bodyHtml,
            nav: nav
        });
    } catch (err) {
        next(err)
    }
}

invCont.buildInvManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("./inventory/management", {
            title: "Inventory Management Dasboard",
            nav
        });
    } catch (err) {
        next(err)
    }
}

invCont.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("./inventory/add-classification", {
            title: "Add a Classification",
            nav,
        });
    } catch (err) {
        next(err);
    }
}

invCont.buildAddInventoryItem = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        let data = await invModel.getClassifications();
        res.render("./inventory/add-inventory", {
            title: "Add an Inventory Item",
            errors: null,
            classifications: data.rows,
            nav
        });
    } catch (err) {
        next(err);
    }
}

invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body;

    const classResult = await invModel.addClassification(classification_name);
    let nav = await utilities.getNav();

    if (classResult) {
        req.flash(
            "notice",
            `The classification "${classification_name}" has been added.`
        );
        res.status(201).render('./inventory/management', {
            title: "Inventory Management Dasboard",
            nav
        });
    } else {
        req.flash(
            "notice",
            `Failed to add classification "${classification_name}"`
        );
        res.status(501).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            nav
        });
    }
}

invCont.addInventoryItem = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const invResult = await invModel.addInventoryItem(
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
    );
    let nav = await utilities.getNav();

    if (invResult) {
        req.flash(
            "notice",
            `The inventory item "${inv_year} ${inv_make} ${inv_model}" has been added.`
        );
        res.status(201).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            nav
        });
    } else {
        req.flash(
            "notice",
            `Failed to add classification "${inv_year} ${inv_make} ${inv_model}"`
        );
        res.status(501).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            nav
        });
    }
}

module.exports = invCont