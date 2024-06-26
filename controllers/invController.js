const invModel = require('../models/inventory-model')
const { Util } = require('../utilities/')

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

        const grid = await Util.buildClassificationGrid(data)
        let nav = await Util.getNav()
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

        const bodyHtml = await Util.buildInvItemDescription(data);
        let nav = await Util.getNav();
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

module.exports = invCont