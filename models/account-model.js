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

module.exports = {getAccountById};