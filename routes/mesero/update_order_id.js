const express = require("express");
const db = require("../../db/conexion")
const { authenticateToken: verificarToken } = require("../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put("/update_order_id", verificarToken, (req, res) => {
    if (req.user.rol !== "mesero") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { id_order, new_name_dish, new_observations } = req.body;

    if (!id_order) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    const waiter_name = req.user.name

    const pending_exist = db.prepare("SELECT id FROM pending_dishes WHERE id = ? AND waiter_name = ?")
    pending_exist.run(id_order, waiter_name)

    if (!pending_exist) {
        return res.status(401).json({ message: "Este Pedido No Existe" }); 
    }

    if (!new_name_dish) {
        const update = db.prepare("UPDATE pending_dishes SET observations = ? WHERE id = ?")
        update.run(new_observations, id_order)
        res.json({ message: "Orden Actualizada Correctamente"});
    }

    else if (!new_observations) {
        const new_dish_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(new_name_dish)

        if (!new_dish_exist) {
            return res.status(401).json({ message: "Este Producto No Existe" }); 
        }

        const update = db.prepare("UPDATE pending_dishes SET name_dish = ? WHERE id = ?")
        update.run(new_name_dish, id_order)
        res.json({ message: "Orden Actualizada Correctamente"});
    }

    else {
        const new_dish_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(new_name_dish)

        if (!new_dish_exist) {
            return res.status(401).json({ message: "Este Producto No Existe" }); 
        }

        const update = db.prepare("UPDATE pending_dishes SET name_dish = ?, observations = ? WHERE id = ?")
        update.run(new_name_dish, new_observations, id_order)
        res.json({ message: "Orden Actualizada Correctamente"})
    }

});

module.exports = app