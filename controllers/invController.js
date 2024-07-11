const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error("No data returned"));
    }
}

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
            title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
            img: {
                url: data.inv_image,
                alt: `${data.inv_year} ${data.inv_make} ${data.inv_model}`
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
        const data = await invModel.getClassifications();
        const classificationSelect = await utilities.buildClassificationList(data);

        res.render("./inventory/management", {
            title: "Inventory Management Dasboard",
            classificationList: classificationSelect,
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
        const data = await invModel.getClassifications();
        const classificationList = await utilities.buildClassificationList(data);
        res.render("./inventory/add-inventory", {
            title: "Add an Inventory Item",
            errors: null,
            classificationList: classificationList,
            nav
        });
    } catch (err) {
        next(err);
    }
}

invCont.editInventoryView = async function (req, res) {
    console.log("Editing an inventory item")
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const data = await invModel.getClassifications();
    const classificationSelect = await utilities.buildClassificationList(data, itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    
    res.render("./inventory/edit-inventory", {
        title: `Edit ${itemName}`,
        nav,
        classificationList: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    });
}

invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body;

    const classResult = await invModel.addClassification(classification_name);
    const data = await invModel.getClassifications();
    const classificationSelect = await utilities.buildClassificationList(data);
    let nav = await utilities.getNav();

    if (classResult) {
        req.flash(
            "notice",
            `The classification "${classification_name}" has been added.`
        );
        res.status(201).render('./inventory/management', {
            title: "Inventory Management Dasboard",
            classificationList: classificationSelect,
            nav
        });
    } else {
        req.flash(
            "notice",
            `Failed to add classification "${classification_name}"`
        );
        res.status(501).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            classificationList: classificationSelect,
            nav
        });
    }
}

invCont.addInventoryItem = async function (req, res) {
    console.log("Adding an inventory item")
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const inv_item = {
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
    }
    const invResult = await invModel.addInventoryItem(inv_item);
    const data = await invModel.getClassifications();
    const classificationSelect = await utilities.buildClassificationList(data);

    let nav = await utilities.getNav();

    if (invResult) {
        req.flash(
            "notice",
            `The inventory item "${inv_year} ${inv_make} ${inv_model}" has been added.`
        );
        res.status(201).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            classificationList: classificationSelect,
            nav
        });
    } else {
        req.flash(
            "notice",
            `Failed to add "${inv_year} ${inv_make} ${inv_model}"`
        );
        res.status(501).render("./inventory/management", {
            title: "Inventory Management Dashboard",
            classificationList: classificationSelect,
            nav
        });
    }
}

module.exports = invCont