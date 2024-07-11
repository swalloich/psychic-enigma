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
        return data.rows[0];
    } catch (err) {
        console.error("getInventoryByInvId error: " + err)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (err) {
        return err.message;
    }
}

async function addInventoryItem(inv_item) {
        try {
            const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
            return await pool.query(sql, [
                inv_item.inv_make,
                inv_item.inv_model,
                inv_item.inv_year,
                inv_item.inv_description,
                inv_item.inv_image,
                inv_item.inv_thumbnail,
                inv_item.inv_price,
                inv_item.inv_miles,
                inv_item.inv_color,
                inv_item.classification_id
            ]);
        } catch (err) {
            return err.message
        }

}

/**
 * Modifies an existing inventory item to have the values in a
 * provided object.
 * @param {Object} inv_item Should be an object containing values for
 *                          each column in the inventory table.
 * @returns The results of the query.
 */
async function editInventoryItem(inv_item) {
    try {
        const sql = `
            UPDATE inventory
            SET inv_make = $1,
                inv_model = $2,
                inv_year = $3,
                inv_description = $4,
                inv_image = $5,
                inv_thumbnail = $6,
                inv_price = $7,
                inv_miles = $8,
                inv_color = $9,
                classification_id = $10
            WHERE inv_id = $11
            RETURNING *;`;
        return await pool.query(sql, [
            inv_item.inv_make,
            inv_item.inv_model,
            inv_item.inv_year,
            inv_item.inv_description,
            inv_item.inv_image,
            inv_item.inv_thumbnail,
            inv_item.inv_price,
            inv_item.inv_miles,
            inv_item.inv_color,
            inv_item.classification_id,
            inv_item.inv_id
        ]);
    } catch (err) {
        return err.message;
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByInvId,
    addClassification,
    addInventoryItem,
    editInventoryItem
};