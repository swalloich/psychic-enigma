const acctModel = require("../models/account-model");
const utilities = require('../utilities');

const accountController = {}

accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    });
}

accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Create an Account",
        errors: null,
        nav,
    });
}

accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await acctModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    );

    if (regResult) {
        req.flash(
            "notice",
            `Contratulations, you're registered ${account_firstname}. Please log in.`
        );
        res.status(201).render('account/login', {
            title: "Login",
            nav,
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        });
    }
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
        let nav = await utilities.getNav()
        // TODO: finish this.
    } catch (err) {
        next(err);
    }
}

module.exports = accountController