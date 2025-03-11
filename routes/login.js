const express = require("express");
const db = require("../db/conexion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express.Router();
const SECRET_KEY = "secreto";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ message: "Usuario y contraseña son requeridos" });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user) {
        return res.status(401).json({ message: "Credenciales Incorrectas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciales Incorrectas" });
    }

    const rol = db.prepare("SELECT rol FROM users WHERE username = ?").get(username);
    const name = db.prepare("SELECT name FROM users WHERE username = ?").get(username)

    const token = jwt.sign({ username: username, rol: rol.rol, name: name.name}, SECRET_KEY, { expiresIn: "24h" });

    res.json({ message: "Inicio de sesión exitoso", token: token });
});

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    app,
    authenticateToken
}