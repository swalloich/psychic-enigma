const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInvId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryByInvId(inventory_id);
    const view_image = {
        url: (data.length > 0) ? data[0].inv_image : null,
        alt: (data.length > 0) ? `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}` : null
    };
    const view_title = (data.length > 0) ? `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}` : null;
    const bodyHtml = await utilities.buildInvItemDescription(data);
    let nav = await utilities.getNav();

    res.render("./inventory/item", {
        title: view_title,
        img: view_image,
        description: bodyHtml,
        nav: nav
    });
}

module.exports = invCont