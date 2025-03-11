const express = require("express");
const db = require("../../../db/conexion");
const { authenticateToken: verificarToken } = require("../../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/add_table", verificarToken, (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name, quantity_persons } = req.body;

    if (!name || !quantity_persons) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    if (quantity_persons <= 0) {
        return res.status(401).json({ message: "La Cantidad De Personas No Puede Ser Igual O Menor A 0" });
    }

    const table_exist = db.prepare("SELECT name FROM tables WHERE name = ?").get(name)

    if (table_exist) {
        return res.status(401).json({ message: "Esta Mesa Ya Existe" });
    } 

    const insert = db.prepare("INSERT INTO tables (name, quantity_person) VALUES (?,?)")

    insert.run(name,quantity_persons)
    res.json({ message: "Mesa Agregada Correctamente"});
});

module.exports = app