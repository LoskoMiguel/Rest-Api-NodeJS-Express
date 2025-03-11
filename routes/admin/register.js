const express = require("express");
const db = require("../../db/conexion");
const bcrypt = require("bcrypt");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
    const { name, username, password, rol } = req.body;

    if (!name || !username || !password || !rol) {
        return res.status(401).json({ message: "Los Datos No Pueden Estar Vacíos" });
    }

    const usuarioExiste = db.prepare("SELECT username FROM users WHERE username = ?").get(username)

    if (usuarioExiste) {
        return res.status(401).json({ message: "Este Usuario Ya Existe" });
    }

    if (password.length <= 6 || username.length <= 3) {
        return res.status(401).json({ message: "La Contraseña O El Usuario Son Demasiado Cortos" });
    }

    const rolesValidos = ["admin", "cocinero", "mesero"];
    if (!rolesValidos.includes(rol)) {
        return res.status(401).json({ message: "Rol No Identificado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insert = db.prepare("INSERT INTO users (username, password, rol, name) VALUES (?, ?, ?, ?)");
    insert.run(username, hashedPassword, rol, name);

    res.json({ message: "Usuario registrado con éxito" });
});

module.exports = app;