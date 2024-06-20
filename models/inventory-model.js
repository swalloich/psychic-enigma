const { DatabaseError } = require('pg')
const pool = require('../database/')

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getInventoryByInvId(inventory_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
            [inventory_id]
        );
        if (data.rowCount > 1) {
            throw Error("More than one result was returned!")
        }
        return data.rows
    } catch (err) {
        console.error("getInventoryByInvId error: " + err)
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId};