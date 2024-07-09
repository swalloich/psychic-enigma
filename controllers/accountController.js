const accountModel = require("../models/account-model");
const utilities = require('../utilities');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

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

accountController.buildAccountManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/account-management", {
        title: "Account Management",
        nav
    });
}

accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
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

accountController.accountLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body;

    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash(
            "notice",
            "Please check your credentials and try again."
        );
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
        return;
    }

    try {
        const valid = await bcrypt.compare(account_password, accountData.account_password);
        if (valid) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            return res.redirect("/account/");
        }
    } catch (err) {
        return new Error('Access Forbidden');
    }
}

module.exports = accountController