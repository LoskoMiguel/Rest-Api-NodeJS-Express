const express = require("express");
const { authenticateToken: verificarToken } = require("./login");

const app = express.Router();

app.get("/dashboard", verificarToken, (req, res) => {
    res.json({ message: `Bienvenido al dashboard, ${req.user.username}, Tu Rol Es ${req.user.rol}` });
});

module.exports = app;