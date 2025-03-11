const express = require("express");
const db = require("../db/conexion");
const { authenticateToken: verificarToken } = require("./login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/show_ready_dishes", verificarToken, (req, res) => {
    try {
        const select = db.prepare("SELECT id, name_table, name_dish, observations, price, estado, waiter_name, cook_name FROM pending_dishes WHERE estado = 'preparado'");
        const ready_dishes = select.all();

        if (ready_dishes.length === 0) {
            return res.status(404).json({ message: "No hay Platos Listos" });
        }

        res.json({ "Platos Listos": ready_dishes });
    } catch (error) {
        console.error("Error al Obtener Los Platos Listos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = app;