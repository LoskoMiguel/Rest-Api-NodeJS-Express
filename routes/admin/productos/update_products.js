const express = require("express");
const db = require("../../../db/conexion");
const { authenticateToken: verificarToken } = require("../../login");

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put("/update_product", verificarToken, (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(401).json({ message: "No Acceso" });
    }

    const { name_product, new_name, new_ingredient, new_price } = req.body;

    if (!name_product) {
        return res.status(401).json({ message: "El Producto No Puede Estar Vacio" });
    }

    const productoExiste = db.prepare("SELECT name FROM products WHERE name = ?").get(name_product)

    if (!productoExiste) {
        return res.status(401).json({ message: "El Producto No Existe" });
    }

    if (new_price < 0) {
        return res.status(401).json({ message: "El Valor Del Precio No Puede Ser Negativo O Igual A 0" });
    }

    if (!new_ingredient && !new_price) {
        const update = db.prepare("UPDATE products set name = ? WHERE name = ?")
        update.run(new_name, name_product)
        res.json({ message: "Nombre De Producto Actualizado Correctamente"});
    }

    else if (!new_name && !new_price) {
        const update = db.prepare("UPDATE products set ingredients = ? WHERE name = ?")
        update.run(new_ingredient, name_product)
        res.json({ message: "Ingredientes Del Producto Actualizado Correctamente"});
    }

    else if (!new_name && !new_ingredient) {
        const update = db.prepare("UPDATE products set price = ? WHERE name = ?")
        update.run(new_price, name_product)
        res.json({ message: "Precio Del Producto Actualizado Correctamente"});
    }

    else if (!new_name) {
        const update = db.prepare("UPDATE products set ingredients = ?, price = ? WHERE name = ?")
        update.run(new_ingredient, new_price, name_product)
        res.json({ message: "Ingredientes Y Precio Del Producto Actualizado Correctamente"});
    }

    else if (!new_ingredient) {
        const update = db.prepare("UPDATE products set name = ?, price = ? WHERE name = ?")
        update.run(new_name, new_price, name_product)
        res.json({ message: "Nombre Y Precio Del Producto Actualizado Correctamente"});
    }

    else if (!new_price) {
        const update = db.prepare("UPDATE products set name = ?, ingredients = ? WHERE name = ?")
        update.run(new_name, new_ingredient, name_product)
        res.json({ message: "Nombre Y Ingredientes Del Producto Actualizado Correctamente"});
    } else {
        const update = db.prepare("UPDATE products set name = ?, ingredients = ?, price = ? WHERE name = ?")
        update.run(new_name, new_ingredient, new_price, name_product)
        res.json({ message: "Producto Actualizado Correctamente"});
    }
});

module.exports = app