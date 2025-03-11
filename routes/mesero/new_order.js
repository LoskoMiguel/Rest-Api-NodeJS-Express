const express = require("express");
const db = require("../../db/conexion")
const { authenticateToken: verificarToken } = require("../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/new_order", verificarToken, (req, res) => {
    if (req.user.rol !== "mesero") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name_table, name_dish, observations } = req.body;

    if (!name_table || !name_dish || !observations) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    const table_exist = db.prepare("SELECT name FROM tables WHERE name = ?").get(name_table)

    if (!table_exist) {
        return res.status(401).json({ message: "Esta Mesa No Existe" }); 
    }

    const dish_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(name_dish)

    if (!dish_exist) {
        return res.status(401).json({ message: "Este Plato No Existe" });
    }

    const dish_price = db.prepare("SELECT price FROM products WHERE name = ?").get(name_dish)

    const insert = db.prepare("INSERT INTO pending_dishes (name_table, name_dish, observations, price, estado, waiter_name, cook_name) VALUES (?,?,?,?,?,?,?)")

    const result = insert.run(name_table, name_dish, observations, dish_price.price, "pendiente", req.user.name, "No Registrado Aun")
    res.json({
        message: "Plato Agregado Correctamente A La Orden",
        order_id: result.lastInsertRowid
    });
});

module.exports = app