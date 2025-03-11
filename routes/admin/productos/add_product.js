const express = require("express");
const db = require("../../../db/conexion");
const { authenticateToken: verificarToken } = require("../../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/add_product", verificarToken, (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name, ingredients, price } = req.body;

    if (!name || !ingredients || !price) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    if (price <= 0) {
        return res.status(401).json({ message: "El Valor Del Precio No Puede Ser Negativo O Igual A 0" });
    }

    const product_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(name)

    if (product_exist) {
        return res.status(401).json({ message: "Este Producto Ya Existe" });
    } 

    const insert = db.prepare("INSERT INTO products (name, ingredients, price) VALUES (?,?,?)")

    insert.run(name,ingredients,price)
    res.json({ message: "Producto Agregado Correctamente"});
});

module.exports = app