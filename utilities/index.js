const invModel = require("../models/inventory-model")
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
        description = `<h2>${data.inv_make.charAt(0).toUpperCase()} ${data.inv_model.charAt(0).toUpperCase()} Details</h2>`;
        description += `<p>Price: $${data.inv_price.toLocaleString()}</p>`;
        description += `<p><span>Description:</span> ${data.inv_description}</p>`;
        description += `<p><span>Color:</span> ${data.inv_color}</p>`;
        description += `<p><span>Miles:</span> ${data.inv_miles.toLocaleString()}</p>`
    }
    return description;
}

module.exports = Util