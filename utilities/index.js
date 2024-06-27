const invModel = require("../models/inventory-model")

/* ****************************************
*  Deliver login view
* *************************************** */
const Util = {}

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInvItemDescription = async function (data) {
    let description = "<p>Vehicle not found!</p>"
    if (data.length > 1) {
        description = "<p>There was a problem while getting the vehicle!</p>";
    } else if (data.length == 1) {
        description = `<h2 class="text-bold">${data[0].inv_make} ${data[0].inv_model} Details</h2>`;
        description += `<p class="text-bold">Price: $${data[0].inv_price.toLocaleString()}</p>`;
        description += `<p><span class="text-bold">Description:</span> ${data[0].inv_description}</p>`;
        description += `<p><span class="text-bold">Color:</span> ${data[0].inv_color}</p>`;
        description += `<p><span class="text-bold">Miles:</span> ${data[0].inv_miles.toLocaleString()}</p>`
    }
    return description;
}

Util.buildLogin = async function (req, res, next) {
    let nav = await Util.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    });
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {Util}