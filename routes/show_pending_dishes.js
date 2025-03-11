const express = require("express");
const db = require("../db/conexion");
const { authenticateToken: verificarToken } = require("./login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/show_pending_dishes", verificarToken, (req, res) => {
    try {
        const select = db.prepare("SELECT id, name_table, name_dish, observations, price, estado, waiter_name FROM pending_dishes WHERE estado = 'pendiente'");
        const pending_dishes = select.all();

        if (pending_dishes.length === 0) {
            return res.status(404).json({ message: "No hay Platos Pendientes" });
        }

        res.json({ "Platos Pendientes": pending_dishes });
    } catch (error) {
        console.error("Error al Obtener Los Platos Pendientes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = app;