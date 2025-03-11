const express = require("express");
const db = require("../../../db/conexion");
const { authenticateToken: verificarToken } = require("../../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.delete("/delete_product", verificarToken, (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name } = req.body;

    if (!name) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    const product_exist = db.prepare("SELECT name FROM products WHERE name = ?").get(name)

    if (!product_exist) {
        return res.status(401).json({ message: "Este Producto No Existe" });
    } 

    const delete_product = db.prepare("DELETE FROM products WHERE name = ?")
    delete_product.run(name)

    res.json({ message: "Producto Eliminado Correctamente"});
});

module.exports = app