const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    const loggedin = (req.cookies.jwt) ? true : false;
    res.render("index", {title: "Home", nav, loggedin});
}

module.exports = baseController