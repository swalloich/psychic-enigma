const pool = require("../database/")

async function getAccountById(account_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.account AS a WHERE a.account_id = $1`,
            [inventory_id]
        );
        if (data.rowCount > 1) {
            throw Error("More than one result was returned!");
        }
    } catch (err) {
        console.error("getAccountById error: " + err);
    }
}

async function registerAccount(account_firstname, account_lastname, account_email, account_password, account_type) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        return error.message;
    }
}

module.exports = {getAccountById, registerAccount};