const express = require("express");
const app = express();
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Configuración de puerto
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
const db = new sqlite3.Database("./biolab.db", (err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos de Biolab");
    }
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Ruta para obtener datos de la base de datos
app.get("/api/reactivos", (req, res) => {
    db.all("SELECT * FROM reactivos", (err, rows) => {
        if (err) {
            console.error("Error al obtener datos:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
