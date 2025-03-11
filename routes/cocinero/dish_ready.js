const express = require("express");
const db = require("../../db/conexion")
const { authenticateToken: verificarToken } = require("../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/dish_ready", verificarToken, (req, res) => {
    if (req.user.rol !== "cocinero") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name_table, name_dish } = req.body;

    if (!name_table || !name_dish) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    const order_exist = db.prepare('SELECT name_table, name_dish FROM pending_dishes WHERE name_table = ? AND name_dish = ?').get(name_table, name_dish)

    if (!order_exist) {
        return res.status(401).json({ message: "La Orden No Existe" });
    }

    const estado_order = db.prepare('SELECT estado FROM pending_dishes WHERE name_table = ? AND name_dish = ?').get(name_table, name_dish)

    if (estado_order.estado === 'preparado') {
        return res.status(401).json({ message: "No Puedes Prepara Un Plato Que Ya Existe" });
    }

    const cook_name = req.user.name
    const dish_ready = db.prepare('UPDATE pending_dishes SET estado = ?, cook_name = ? WHERE name_table = ? AND name_dish = ?')
    dish_ready.run("preparado", cook_name, name_table, name_dish)
    res.json({
        message: "Plato Preparado Correctamente"
    });
});

module.exports = app