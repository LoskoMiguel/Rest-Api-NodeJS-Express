const express = require("express");
const db = require("../../../db/conexion");
const { authenticateToken: verificarToken } = require("../../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put("/update_table", verificarToken, (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name_table, new_name_table, new_quantity_persons } = req.body;

    if (!name_table) {
        return res.status(401).json({ message: "Los Datos No Estan Completos son requeridos" });
    }

    if (new_quantity_persons <= 0) {
        return res.status(401).json({ message: "La Cantidad De Personas No Puede Ser Igual O Menor A 0" });
    }

    const table_exist = db.prepare("SELECT name FROM tables WHERE name = ?").get(name_table)

    if (!table_exist) {
        return res.status(401).json({ message: "Esta Mesa No Existe" });
    } 

    const update = db.prepare("UPDATE FROM tables SET name = ?, quantity_persons = ? WHERE name = ?")
    
    update.run(new_name, new_quantity_persons, name_table)

    res.json({ message: "Mesa Actualizada Correctamente"});
});

module.exports = app