const express = require("express");
const db = require("../db/conexion");
const { authenticateToken: verificarToken } = require("./login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/show_products", verificarToken, (req, res) => {
    try {
        const select = db.prepare("SELECT name, ingredients, price FROM products");
        const products = select.all();

        if (products.length === 0) {
            return res.status(404).json({ message: "No hay productos disponibles" });
        }

        res.json({ productos: products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = app;
