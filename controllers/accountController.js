const acctModel = require("../models/account-model");
const { Util } = require('../utilities');

const accountController = {}

accountController.buildLogin = async function (req, res, next) {
    let nav = await Util.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    });
}

accountController.buildRegistration = async function (req, res, next) {
    let nav = await Util.getNav();
    res.render("account/register", {
        title: "Create an Account",
        nav,
    });
}

accountController.buildAccountById = async function (req, res, next) {
    try {
        const accountId = req.params.accountId;
        const data = await acctModel.getAccountById(accountId);

        if (data.length == 0) {
            const error = new Error("No accounts with that ID were found.");
            error.status = 404;
            next(error);
        }

        // const account = await utilities.buildAccountView(data);
        let nav = await Util.getNav()
        // TODO: finish this.
    } catch (err) {
        next(err);
    }
}

module.exports = accountController