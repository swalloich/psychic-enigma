const { Util } = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await Util.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = baseController