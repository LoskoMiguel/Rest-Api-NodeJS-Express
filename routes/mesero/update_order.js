const express = require("express");
const db = require("../../db/conexion")
const { authenticateToken: verificarToken } = require("../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put("/update_order", verificarToken, (req, res) => {
    if (req.user.rol !== "mesero") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name_table, name_dish, new_name_dish, new_observations } = req.body;

    if (!name_table || !name_dish) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    const pending_exist = db.prepare("SELECT name_table, name_dish FROM pending_dishes WHERE name_table = ? AND name_dish = ?").get(name_table, name_dish)

    if (!pending_exist) {
        return res.status(401).json({ message: "Este Pedido No Existe" }); 
    }

    const waiter_name = req.user.name

    const waiter_name_exist = db.prepare("SELECT name_table, name_dish FROM pending_dishes WHERE waiter_name = ? AND name_table = ? AND name_dish = ?").get(waiter_name, name_table, name_dish)
    if (!waiter_name_exist) {
        return res.status(401).json({ message: "Esta Orden No Es Tuya" });
    }

    if (!new_name_dish) {
        const update = db.prepare("UPDATE pending_dishes SET observations = ? WHERE name_table = ? AND name_dish = ? AND waiter_name = ?")
        update.run(new_observations, name_table, name_dish, waiter_name)
        res.json({ message: "Orden Actualizada Correctamente"});
    }

    else if (!new_observations) {
        const new_dish_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(new_name_dish)

        if (!new_dish_exist) {
            return res.status(401).json({ message: "Este Producto No Existe" }); 
        }

        const update = db.prepare("UPDATE pending_dishes SET name_dish = ? WHERE name_table = ? AND name_dish = ? AND waiter_name = ?")
        update.run(new_name_dish, name_table, name_dish, waiter_name)
        res.json({ message: "Orden Actualizada Correctamente"});
    }

    else {
        const new_dish_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(new_name_dish)

        if (!new_dish_exist) {
            return res.status(401).json({ message: "Este Producto No Existe" }); 
        }

        const update = db.prepare("UPDATE pending_dishes SET name_dish = ?, observations = ? WHERE name_table = ? AND name_dish = ? AND waiter_name = ?")
        update.run(new_name_dish, new_observations, name_table, name_dish, waiter_name)
        res.json({ message: "Orden Actualizada Correctamente"})
    }

});

module.exports = app